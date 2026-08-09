'use client'

import { useUsage } from '@/app/contexts/UsageContext'
import { Bot, Send, Sparkles, User } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

interface Message {
  id: number
  content: string
  isBot: boolean
  timestamp: Date
}

interface ChatSidebarProps {
  messages: Message[]
  chatInput: string
  showSuggestions: boolean
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onSuggestionClick: (suggestion: string) => void
}

function ChatSidebar({
  messages,
  chatInput,
  showSuggestions,
  onInputChange,
  onSendMessage,
  onSuggestionClick,
}: ChatSidebarProps) {
  const { canChat } = useUsage()

  const chatSuggestions = [
    'What deadlines were discussed in this meeting?',
    'Write a follow-up email for the team',
    'What suggestions was I given during the discussion?',
    'Summarize the key action items from this meeting',
  ]

  return (
    <div className="bg-white rounded-[24px] border border-black/[0.08] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col h-full min-h-[480px]">
      {/* Header */}
      <div className="pb-4 border-b border-black/[0.06] mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-[10px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base text-[#111111] tracking-tight">
            Meeting Assistant
          </h3>
        </div>
        <p className="text-xs text-[#5A5A5A]">Ask me anything about this meeting</p>
      </div>

      {/* Message & Suggestions Body */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-[260px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            {message.isBot && (
              <div className="w-7 h-7 rounded-[8px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-[18px] p-3.5 text-xs leading-relaxed ${
                message.isBot
                  ? 'bg-[#F8F6F1] border border-black/[0.06] text-[#111111]'
                  : 'bg-[#0F0F10] text-white shadow-xs font-medium'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {!message.isBot && (
              <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {messages.length > 0 && !messages[messages.length - 1].isBot && (
          <div className="flex justify-start gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-[#F8F6F1] border border-black/[0.06] text-[#5A5A5A] rounded-[16px] p-3 text-xs font-medium">
              Thinking...
            </div>
          </div>
        )}

        {showSuggestions && messages.length === 0 && (
          <div className="space-y-2.5 my-auto py-2">
            {chatSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                disabled={!canChat}
                type="button"
                className={`w-full text-left rounded-[16px] p-3.5 border transition-all duration-200 cursor-pointer group flex items-start gap-2.5 ${
                  canChat
                    ? 'bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#111111] border-black/[0.08] hover:border-[#FF5A0A]/30 hover:-translate-y-[2px] shadow-xs'
                    : 'bg-[#F4EFE5]/50 text-[#808080] border-transparent cursor-not-allowed'
                }`}
              >
                <div className="w-6 h-6 rounded-[8px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs font-bold text-[#111111] group-hover:text-[#FF5A0A] transition-colors leading-snug">
                  {suggestion}
                </p>
              </button>
            ))}
          </div>
        )}

        {!canChat && (
          <div className="text-center p-3 bg-[#FF5A0A]/10 border border-[#FF5A0A]/20 rounded-[16px]">
            <p className="text-xs font-semibold text-[#FF5A0A] mb-1">
              Daily chat limit reached
            </p>
            <Link href="/pricing" className="text-xs font-bold text-[#111111] underline">
              Upgrade to continue chatting
            </Link>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 border-t border-black/[0.06] mt-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onSendMessage()
              }
            }}
            placeholder={canChat ? 'Ask about this meeting...' : 'Daily limit reached'}
            className="flex-1 h-[46px] rounded-[14px] bg-[#F8F6F1] border border-black/[0.12] px-3.5 text-xs text-[#111111] placeholder-[#808080] focus:outline-none focus:ring-2 focus:ring-[#FF5A0A] transition-all"
            disabled={!canChat}
          />

          <button
            type="button"
            onClick={onSendMessage}
            disabled={!chatInput.trim() || !canChat}
            className="w-[46px] h-[46px] rounded-[14px] bg-[#0F0F10] hover:bg-black text-white flex items-center justify-center shrink-0 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-xs"
          >
            <div className="w-5 h-5 rounded-[5px] bg-[#FF5A0A] flex items-center justify-center text-white">
              <Send className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
