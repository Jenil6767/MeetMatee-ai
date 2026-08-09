'use client'

import React from 'react'
import useChatAll from './hooks/useChatAll'
import ChatSuggestions from './components/ChatSuggestions'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import { motion } from 'framer-motion'

function Chat() {
  const {
    chatInput,
    messages,
    showSuggestions,
    isLoading,
    chatSuggestions,
    handleSendMessage,
    handleSuggestionClick,
    handleInputChange,
  } = useChatAll()

  return (
    <div className="w-full flex-1 flex flex-col min-h-[calc(100vh-140px)]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-1 flex flex-col max-w-4xl mx-auto w-full"
      >
        <div className="flex-1 overflow-y-auto min-h-0">
          {messages.length === 0 && showSuggestions ? (
            <ChatSuggestions
              suggestions={chatSuggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          ) : (
            <ChatMessages messages={messages} isLoading={isLoading} />
          )}
        </div>

        <ChatInput
          chatInput={chatInput}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  )
}

export default Chat
