'use client'

import React from 'react'
import { Bot, Sparkles } from 'lucide-react'

interface ChatSuggestionsProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
}

function ChatSuggestions({
  suggestions,
  onSuggestionClick,
}: ChatSuggestionsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-[20px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center mx-auto mb-4 border border-[#FF5A0A]/20 shadow-xs">
          <Bot className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-[#111111] tracking-[-0.03em] mb-2">
          Ask AI Chatbot about all your meetings
        </h2>

        <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] max-w-md mx-auto leading-[1.6]">
          I can search across your meeting transcripts to summarize discussions, locate key decisions, and answer any questions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-5 bg-white border border-black/[0.08] rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_45px_rgba(255,90,10,0.12)] hover:border-[#FF5A0A]/30 hover:-translate-y-[4px] transition-all duration-300 text-left group cursor-pointer flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-[10px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-[#111111] group-hover:text-[#FF5A0A] transition-colors leading-snug">
              {suggestion}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatSuggestions
