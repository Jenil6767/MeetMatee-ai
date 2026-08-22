import { useChatCore } from "@/app/hooks/chat/useChatCore"
import { useAuth } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import useSWR from "swr"

export interface MeetingData {
    id: string
    title: string
    description?: string
    startTime: string
    endTime: string
    transcript?: any
    summary?: string
    actionItems?: Array<{
        id: number
        text: string
    }>
    processed: boolean
    processedAt?: string
    recordingUrl?: string
    emailSent: boolean
    emailSentAt?: string
    userId?: string
    user?: {
        name?: string
        email?: string
    }
    ragProcessed?: boolean
    transcriptReady?: boolean
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Failed to fetch meeting data')
    }
    return res.json()
}

export function useMeetingDetail() {
    const params = useParams()
    const meetingId = params.meetingId as string
    const { userId, isLoaded } = useAuth()

    const [isOwner, setIsOwner] = useState(false)
    const [userChecked, setUserChecked] = useState(false)

    const [activeTab, setActiveTab] = useState<'summary' | 'transcript'>('summary')
    const [localActionItems, setLocalActionItems] = useState<any[]>([])

    const shouldFetch = Boolean(isLoaded && meetingId)
    const { data: meetingData, error, isLoading, mutate } = useSWR<MeetingData>(
        shouldFetch ? `/api/meetings/${meetingId}` : null,
        fetcher,
        {
            refreshInterval: (data) => {
                // If meeting is already fully processed with AI and transcript, stop polling
                if (data?.processed && data?.transcriptReady) {
                    return 0
                }
                // Poll every 3 seconds while waiting for meeting to finish or AI to process
                return 3000
            },
            revalidateOnFocus: true,
            dedupingInterval: 2000,
        }
    )

    const chat = useChatCore({
        apiEndpoint: '/api/rag/chat-meeting',
        getRequestBody: (input) => (
            {
                meetingId, question: input
            }
        )
    })

    const handleSendMessage = async () => {
        if (!chat.chatInput.trim() || !isOwner) {
            return
        }
        await chat.handleSendMessage()
    }

    const handleSuggestionClick = (suggestion: string) => {
        if (!isOwner) {
            return
        }

        chat.handleSuggestionClick(suggestion)
    }

    const handleInputChange = (value: string) => {
        if (!isOwner) {
            return
        }

        chat.handleInputChange(value)
    }

    useEffect(() => {
        if (meetingData && isLoaded) {
            const ownerStatus = userId === meetingData.userId
            setIsOwner(ownerStatus)
            setUserChecked(true)

            if (meetingData.actionItems && meetingData.actionItems.length > 0) {
                setLocalActionItems(meetingData.actionItems)
            } else {
                setLocalActionItems([])
            }
        } else if (!isLoading && !meetingData) {
            setUserChecked(true)
        }
    }, [meetingData, userId, isLoaded, isLoading])

    useEffect(() => {
        const processTranscript = async () => {
            try {
                if (!meetingData) return
                if (meetingData.transcript && !meetingData.ragProcessed && userId === meetingData.userId) {
                    let transcriptText = ''
                    if (typeof meetingData.transcript === 'string') {
                        transcriptText = meetingData.transcript
                    } else if (Array.isArray(meetingData.transcript)) {
                        transcriptText = meetingData.transcript
                            .map((segment: any) => `${segment.speaker || 'Speaker'}: ${(segment.words || []).map((w: any) => w.word).join(' ')}`)
                            .join('\n')
                    }

                    await fetch('/api/rag/process', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            meetingId,
                            transcript: transcriptText,
                            meetingTitle: meetingData.title
                        })
                    })

                    mutate()
                }
            } catch (error) {
                console.error('error checking RAG processing:', error)
            }
        }
        if (isLoaded && userChecked && meetingData) {
            processTranscript()
        }
    }, [meetingData, meetingId, userId, isLoaded, userChecked, mutate])

    const deleteActionItem = async (id: number) => {
        if (!isOwner) {
            return
        }

        setLocalActionItems(prev => prev.filter(item => item.id !== id))
        mutate()
    }

    const addActionItem = async (_text: string) => {
        if (!isOwner) {
            return
        }
        mutate()
    }

    const displayActionItems = localActionItems.length > 0
        ? localActionItems.map((item: any) => ({
            id: item.id,
            text: item.text
        }))
        : []


    const meetingInfoData = meetingData ? {
        title: meetingData.title,
        date: new Date(meetingData.startTime).toLocaleDateString(),
        time: `${new Date(meetingData.startTime).toLocaleTimeString()} - ${new Date(meetingData.endTime).toLocaleTimeString()}`,
        userName: meetingData.user?.name || "User"
    } : {
        title: "loading...",
        date: "loading...",
        time: "loading...",
        userName: "loading...",
    }

    return {
        meetingId,
        isOwner,
        userChecked,
        activeTab,
        setActiveTab,
        localActionItems,
        setLocalActionItems,
        meetingData: meetingData ?? null,
        loading: isLoading || (!meetingData && !error),
        chatInput: chat.chatInput,
        setChatInput: chat.setChatInput,
        messages: chat.messages,
        setMessages: chat.setMessages,
        showSuggestions: chat.showSuggestions,
        setShowSuggestions: chat.setShowSuggestions,
        isLoading: chat.isLoading,
        setIsLoading: chat.setIsLoading,
        handleSendMessage,
        handleSuggestionClick,
        handleInputChange,
        deleteActionItem,
        addActionItem,
        displayActionItems,
        meetingInfoData,
        mutate
    }
}