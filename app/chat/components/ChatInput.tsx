'use client'

import React from 'react'
import { useUsage } from '@/app/contexts/UsageContext'
import { Send } from 'lucide-react'
import Link from 'next/link'

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
  isLoading,
}: ChatInputProps) {
  const { canChat, usage, limits } = useUsage()

  return (
    <div className="pt-2 pb-4">
      {!canChat && usage && (
        <div className="max-w-4xl mx-auto mb-3 p-3.5 bg-[#FF5A0A]/10 border border-[#FF5A0A]/20 rounded-[18px] text-center">
          <p className="text-xs font-semibold text-[#FF5A0A]">
            Daily limit reached ({usage.chatMessagesToday}/{limits.chatMessages} messages used).{' '}
            <Link href="/pricing" className="underline font-bold ml-1 hover:text-[#E94E08]">
              Upgrade your plan
            </Link>{' '}
            to continue chatting.
          </p>
        </div>
      )}

      <div className="bg-white rounded-[24px] border border-black/[0.08] p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex items-center gap-3 max-w-4xl mx-auto">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder={
            canChat
              ? 'Ask about any meeting - deadlines, decisions, action items, participants...'
              : 'Daily chat limit reached - upgrade to continue'
          }
          className="flex-1 bg-transparent px-4 py-2 text-sm text-[#111111] placeholder-[#808080] focus:outline-none"
          disabled={isLoading || !canChat}
        />

        <button
          onClick={onSendMessage}
          disabled={isLoading || !canChat || !chatInput.trim()}
          className="w-12 h-12 rounded-[16px] bg-[#0F0F10] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-xs"
        >
          <div className="w-6 h-6 rounded-[6px] bg-[#FF5A0A] flex items-center justify-center text-white">
            <Send className="h-3.5 w-3.5" />
          </div>
        </button>
      </div>
    </div>
  )
}

export default ChatInput
