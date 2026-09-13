import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import useSWR from "swr"

export interface CalendarEvent {
    id: string
    summary?: string
    start?: {
        dateTime?: string
        date?: string
    }
    attendees?: Array<{ email: string }>
    location?: string
    hangoutLink?: string
    conferenceData?: any
    botScheduled?: boolean
    meetingId?: string
}

export interface PastMeeting {
    id: string
    title: string
    description?: string | null
    meetingUrl: string | null
    startTime: Date
    endTime: Date
    attendees?: any
    transcriptReady: boolean
    processed: boolean
    recordingUrl?: string | null
    speakers?: any
}

interface UpcomingResult {
    connected: boolean
    events: CalendarEvent[]
    error?: string
}

const upcomingFetcher = async (): Promise<UpcomingResult> => {
    const statusResponse = await fetch('/api/user/calendar-status')
    const statusData = await statusResponse.json()

    if (!statusData.connected) {
        return {
            connected: false,
            events: [],
            error: 'Calendar not connected for auto-sync. Connect to enable auto syncing.'
        }
    }

    const response = await fetch('/api/meetings/upcoming')
    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch meetings')
    }

    return {
        connected: Boolean(result.connected),
        events: (result.events || []) as CalendarEvent[]
    }
}

export function useMeetings() {
    const { userId } = useAuth()
    const [pastMeetings, setPastMeetings] = useState<PastMeeting[]>([])
    const [pastLoading, setPastLoading] = useState(false)
    const [botToggles, setBotToggles] = useState<{ [key: string]: boolean }>({})
    const [searchQuery, setSearchQuery] = useState('')

    const [manualRefreshing, setManualRefreshing] = useState(false)

    // SWR Hook for upcoming meetings: background polling + auto-sync when refocusing tab
    const {
        data: upcomingData,
        error: swrError,
        isLoading: upcomingIsLoading,
        isValidating: upcomingIsValidating,
        mutate: mutateUpcoming
    } = useSWR<UpcomingResult>(
        userId ? '/api/meetings/upcoming' : null,
        upcomingFetcher,
        {
            revalidateOnFocus: true,     // Auto-sync when switching back to tab from Google Meet
            revalidateOnReconnect: true, // Auto-sync if internet connection drops & recovers
            refreshInterval: 15000,      // Silent background poll every 15 seconds
            dedupingInterval: 4000,      // Deduplicate requests within 4 seconds
            shouldRetryOnError: true,
            errorRetryCount: 3,
        }
    )

    // Clock ticker updating every 5 seconds to dynamically remove meetings whose start time has arrived
    const [currentTime, setCurrentTime] = useState(() => Date.now())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now())
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    // Track meetings joined in current session to remove them instantly from UI
    const [joinedMeetingIds, setJoinedMeetingIds] = useState<Set<string>>(new Set())

    const upcomingEvents = (upcomingData?.events ?? []).filter(event => {
        if (joinedMeetingIds.has(event.id)) {
            return false
        }
        const start = event.start?.dateTime || event.start?.date
        if (!start) return true
        // Automatically hide meetings whose start time has arrived or passed (meeting in progress/done)
        return new Date(start).getTime() > currentTime
    })

    const handleJoinMeeting = (eventId: string) => {
        setJoinedMeetingIds(prev => new Set(prev).add(eventId))
        mutateUpcoming(
            current => {
                if (!current) return current
                return {
                    ...current,
                    events: current.events.filter(e => e.id !== eventId)
                }
            },
            { revalidate: false }
        )
    }
    const connected = upcomingData?.connected ?? false
    const error = swrError
        ? (swrError.message || 'Failed to fetch calendar events. Please try again.')
        : (upcomingData?.error ?? '')
    const loading = upcomingIsLoading || upcomingIsValidating || manualRefreshing
    const initialLoading = !upcomingData && upcomingIsLoading

    // Sync bot toggles with fetched upcoming events without overwriting active user edits
    useEffect(() => {
        if (upcomingData?.events) {
            setBotToggles(prev => {
                const next = { ...prev }
                upcomingData.events.forEach((event: CalendarEvent) => {
                    if (next[event.id] === undefined) {
                        next[event.id] = event.botScheduled ?? true
                    }
                })
                return next
            })
        }
    }, [upcomingData?.events])

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalMeetings, setTotalMeetings] = useState(0)
    const PAGE_LIMIT = 5

    useEffect(() => {
        if (userId) {
            fetchPastMeetings(1)
        }

        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const err = params.get('error')
            if (err === 'email_mismatch') {
                toast.error('Connection Failed', {
                    description: 'Please connect the Google Calendar that matches your account email.',
                    duration: 5000,
                })
                window.history.replaceState({}, document.title, window.location.pathname)
            }
        }
    }, [userId])

    // Auto-refresh past meetings silently in the background:
    // - Every 5 seconds if any meeting is still processing
    // - Every 15 seconds normally so new completed meetings pop up automatically with zero manual refreshes
    useEffect(() => {
        if (!userId) return

        const hasPendingMeetings = pastMeetings.some(m => !m.transcriptReady || !m.processed)
        const pollInterval = hasPendingMeetings ? 5000 : 15000

        const interval = setInterval(() => {
            fetchPastMeetings(currentPage, searchQuery, false)
        }, pollInterval)

        return () => clearInterval(interval)
    }, [userId, pastMeetings, currentPage, searchQuery])

    const fetchUpcomingEvents = async () => {
        setManualRefreshing(true)
        try {
            await mutateUpcoming()
        } finally {
            setManualRefreshing(false)
        }
    }

    const syncCalendar = async () => {
        setManualRefreshing(true)
        try {
            const response = await fetch('/api/meetings/sync', { method: 'POST' })
            if (response.ok) {
                await mutateUpcoming()
            } else {
                toast.error('Failed to sync calendar', {
                    description: 'Please check your connection and try again.',
                })
            }
        } catch (error) {
            toast.error('Error', { description: 'Failed to sync calendar.' })
        } finally {
            setManualRefreshing(false)
        }
    }

    const fetchPastMeetings = async (page: number = 1, search: string = searchQuery, showSpinner: boolean = true) => {
        if (showSpinner) setPastLoading(true)
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: PAGE_LIMIT.toString(),
                ...(search ? { search } : {})
            })
            const response = await fetch(`/api/meetings/past?${queryParams.toString()}`, { cache: 'no-store' })
            const result = await response.json()

            if (!response.ok) {
                console.error('faild to fetch past meetings:', result.error)
                return
            }

            if (result.error) {
                return
            }
            setPastMeetings(result.meetings as PastMeeting[])
            setCurrentPage(result.page ?? page)
            setTotalPages(result.totalPages ?? 1)
            setTotalMeetings(result.total ?? 0)
        } catch (error) {
            console.error('faild to fetch past meetings:', error)
        } finally {
            if (showSpinner) setPastLoading(false)
        }
    }

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return
        fetchPastMeetings(page)
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        fetchPastMeetings(1, query)
    }

    const clearSearch = () => {
        setSearchQuery('')
        fetchPastMeetings(1, '')
    }

    const toggleBot = async (eventId: string) => {
        try {
            const event = upcomingEvents.find(e => e.id === eventId)
            if (!event?.meetingId) {
                return
            }

            setBotToggles(prev => ({
                ...prev,
                [eventId]: !prev[eventId]
            }))

            const response = await fetch(`/api/meetings/${event.meetingId}/bot-toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    botScheduled: !botToggles[eventId]
                })
            })

            if (!response.ok) {
                setBotToggles(prev => ({
                    ...prev,
                    [eventId]: !prev[eventId]
                }))
            }
        } catch {
            setBotToggles(prev => ({
                ...prev,
                [eventId]: !prev[eventId]
            }))
        }
    }

    const directOAuth = async () => {
        setManualRefreshing(true)
        try {
            window.location.href = '/api/auth/google/direct-connect'
        } catch {
            toast.error('Failed to start direct OAuth')
            setManualRefreshing(false)
        }
    }

    const getAttendeeList = (attendees: any): string[] => {
        if (!attendees) {
            return []
        }

        try {
            const parsed = JSON.parse(String(attendees))
            if (Array.isArray(parsed)) {
                return parsed.map(name => String(name).trim())
            }
            return [String(parsed).trim()]
        } catch {
            const attendeeString = String(attendees)
            return attendeeString.split(',').map(name => name.trim()).filter(Boolean)
        }
    }

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return {
        userId,
        upcomingEvents,
        pastMeetings,
        loading,
        pastLoading,
        connected,
        error,
        botToggles,
        initialLoading,
        currentPage,
        totalPages,
        totalMeetings,
        fetchUpcomingEvents,
        fetchPastMeetings,
        goToPage,
        toggleBot,
        directOAuth,
        getAttendeeList,
        getInitials,
        searchQuery,
        handleSearch,
        clearSearch,
        syncCalendar,
        handleJoinMeeting
    }

}