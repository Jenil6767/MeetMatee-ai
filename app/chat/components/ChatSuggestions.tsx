import React from 'react'

interface ChatSuggestionsProps {
    suggestions: string[]
    onSuggestionClick: (suggestion: string) => void
}

function ChatSuggestions({ suggestions, onSuggestionClick }: ChatSuggestionsProps) {
    return (
        <div className='flex flex-col items-center justify-center h-full space-y-8'>
            <div className='text-center'>
                <h2 className='text-xl font-semibold text-foreground mb-3'>
                    Ask AI chatbot any question about all your meetings
                </h2>

                <p className='text-muted-foreground'>
                    I can search across all your meetings to find information, summarize discussions, and answer questions
                </p>

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl'>
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className='p-5 bg-card border border-border rounded-2xl shadow-sm hover:border-[#5B5CEB]/40 hover:bg-[#5B5CEB]/5 hover:shadow-md transition-all duration-200 text-left group cursor-pointer'
                    >
                        <p className='text-sm text-foreground group-hover:text-[#5B5CEB] transition-colors leading-relaxed font-medium'>
                            ⚡️ {suggestion}
                        </p>

                    </button>
                ))}

            </div>

        </div>
    )
}

export default ChatSuggestions
