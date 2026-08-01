import React from 'react'

interface Message {
    id: number
    content: string
    isBot: boolean
    timestamp: Date
}

interface ChatMessagesProps {
    messages: Message[]
    isLoading: boolean
}

function ChatMessages({
    messages,
    isLoading
}: ChatMessagesProps) {
    return (
        <div className='space-y-4'>
            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] rounded-2xl p-4 shadow-xs ${message.isBot
                        ? 'bg-card border border-border text-foreground'
                        : 'bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] text-white'
                        }`}>
                        <p className='text-sm leading-relaxed'>{message.content}</p>

                    </div>

                </div>
            ))}

            {isLoading && (
                <div className='flex justify-start'>
                    <div className='bg-card border border-border rounded-2xl p-4 shadow-sm'>
                        <p className='text-sm text-muted-foreground font-medium animate-pulse'>🤖 Searching through all your meetings...</p>

                    </div>

                </div>
            )}

        </div>
    )
}

export default ChatMessages
