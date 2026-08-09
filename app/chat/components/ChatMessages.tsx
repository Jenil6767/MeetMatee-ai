'use client'

import React from 'react'
import { Bot, Loader2, User } from 'lucide-react'

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

function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3.5 ${message.isBot ? 'justify-start' : 'justify-end'}`}
        >
          {message.isBot && (
            <div className="w-9 h-9 rounded-[12px] bg-[#FFF2EA] text-[#FF5A0A] border border-[#FF5A0A]/20 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-5 h-5" />
            </div>
          )}

          <div
            className={`max-w-[80%] p-5 text-sm ${
              message.isBot
                ? 'bg-white rounded-[24px] rounded-tl-[4px] border border-black/[0.08] text-[#111111] shadow-[0_12px_40px_rgba(0,0,0,0.06)] font-normal tracking-[-0.01em] leading-[1.6]'
                : 'bg-[#0F0F10] text-white rounded-[24px] rounded-tr-[4px] shadow-sm font-normal tracking-[-0.01em] leading-[1.6]'
            }`}
          >
            <p className="whitespace-pre-wrap font-normal tracking-[-0.01em] leading-[1.6]">{message.content}</p>
          </div>

          {!message.isBot && (
            <div className="w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-1">
              <User className="w-4 h-4" />
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start items-center gap-3">
          <div className="w-9 h-9 rounded-[12px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="bg-white border border-black/[0.08] rounded-[20px] px-5 py-3.5 shadow-xs flex items-center gap-2 text-xs font-semibold text-[#5A5A5A]">
            <Loader2 className="w-4 h-4 text-[#FF5A0A] animate-spin" />
            <span>Searching through all your meetings & generating insights...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatMessages
