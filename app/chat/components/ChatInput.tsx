import { useUsage } from '@/app/contexts/UsageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import React from 'react'

interface ChatInputProps {
    chatInput: string
    onInputChange: (value: string) => void
    onSendMessage: () => void
    isLoading: boolean
}

function ChatInput({
    chatInput,
    onInputChange,
    onSendMessage,
    isLoading
}: ChatInputProps) {

    const { canChat, usage, limits } = useUsage()
    return (
        <div className='p-6 bg-background/80 backdrop-blur-md border-t border-border'>
            {!canChat && usage && (
                <div className='max-w-4xl mx-auto mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl'>
                    <p className='text-sm text-amber-600 dark:text-amber-400 text-center font-medium'>
                        Daily limit reached ({usage.chatMessagesToday}/{limits.chatMessages} messages used).
                        <a href="/pricing" className='underline font-semibold ml-1 hover:text-amber-700'>Upgrade your plan</a> to continue chatting.

                    </p>
                </div>
            )}

            <div className='flex gap-3 max-w-4xl mx-auto'>
                <Input
                    type='text'
                    value={chatInput}
                    onChange={e => onInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                    placeholder={canChat ? 'Ask about any meeting - deadlines, decisions, action items, participants...' : 'Daily chat limit reached - upgrade to continue'}
                    className='flex-1 rounded-xl border-border focus:border-[#5B5CEB] h-12 text-sm shadow-xs'
                    disabled={isLoading || !canChat}
                />

                <Button
                    onClick={onSendMessage}
                    disabled={isLoading || !canChat}
                    className='px-5 h-12 bg-[#5B5CEB] hover:bg-[#4F46E5] text-white rounded-xl shadow-md transition-all cursor-pointer'

                >
                    <Send className='h-4 w-4' />
                </Button>

            </div>
        </div>
    )
}

export default ChatInput
