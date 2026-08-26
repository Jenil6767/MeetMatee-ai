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

    // SWR Hook for upcoming meetings: silent background polling (no aggressive requests on tab switches)
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
            revalidateOnFocus: false,    // Do NOT fire API requests every time the user switches tabs
            revalidateOnReconnect: true, // Auto-sync if internet connection drops & recovers
            refreshInterval: 60000,      // Silent background poll every 60 seconds (max 60s for new/canceled events)
            dedupingInterval: 10000,     // Deduplicate requests within 10 seconds
            shouldRetryOnError: true,
            errorRetryCount: 3,
        }
    )

    const upcomingEvents = upcomingData?.events ?? []
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

    // Auto-refresh past meetings if any meeting is still awaiting transcript processing
    useEffect(() => {
        if (!userId || pastMeetings.length === 0) return

        const hasPendingMeetings = pastMeetings.some(m => !m.transcriptReady || !m.processed)
        if (!hasPendingMeetings) return

        const interval = setInterval(() => {
            fetchPastMeetings(currentPage, searchQuery)
        }, 5000)

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

    const fetchPastMeetings = async (page: number = 1, search: string = searchQuery) => {
        setPastLoading(true)
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
        }
        setPastLoading(false)
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
        setLoading(true)
        try {
            window.location.href = '/api/auth/google/direct-connect'
        } catch {
            setError('Failed to start direct OAuth')
            setLoading(false)
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
        syncCalendar
    }

}