'use client'

import React from 'react'
import { useMeetingDetail } from './hooks/useMeetingDetail'
import MeetingHeader from './components/MeetingHeader'
import MeetingInfo from './components/MeetingInfo'
import ActionItems from './components/action-items/ActionItems'
import TranscriptDisplay from './components/TranscriptDisplay'
import ChatSidebar from './components/ChatSidebar'
import CustomAudioPlayer from './components/AudioPlayer'
import { motion } from 'framer-motion'

function MeetingDetail() {
  const {
    meetingId,
    isOwner,
    userChecked,
    chatInput,
    messages,
    showSuggestions,
    activeTab,
    setActiveTab,
    meetingData,
    loading,
    handleSendMessage,
    handleSuggestionClick,
    handleInputChange,
    deleteActionItem,
    addActionItem,
    displayActionItems,
    meetingInfoData,
  } = useMeetingDetail()

  return (
    <div className="w-full pb-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-6"
      >
        <MeetingHeader
          title={meetingData?.title || 'Meeting Details'}
          meetingId={meetingId}
          summary={meetingData?.summary}
          actionItems={
            meetingData?.actionItems?.map((item) => `• ${item.text}`).join('\n') || ''
          }
          isOwner={isOwner}
          isLoading={!userChecked}
        />

        {/* 2-Column Main Workspace Grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Left Content Area */}
          <div
            className={`flex-1 w-full min-w-0 ${
              !userChecked ? '' : !isOwner ? 'max-w-4xl mx-auto' : ''
            }`}
          >
            <MeetingInfo meetingData={meetingInfoData} />

            <div className="mt-4 mb-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-black/[0.08] mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'summary'
                      ? 'border-[#FF5A0A] text-[#FF5A0A]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#111111]'
                  }`}
                >
                  Summary & Actions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('transcript')}
                  className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'transcript'
                      ? 'border-[#FF5A0A] text-[#FF5A0A]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#111111]'
                  }`}
                >
                  Transcript
                </button>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'summary' && (
                  <div>
                    {loading ? (
                      <div className="bg-white border border-black/[0.08] rounded-[24px] p-8 text-center shadow-xs">
                        <div className="w-7 h-7 rounded-full border-2 border-[#FF5A0A] border-t-transparent animate-spin mx-auto mb-3" />
                        <p className="text-sm text-[#5A5A5A]">Loading meeting data...</p>
                      </div>
                    ) : meetingData?.processed ? (
                      <div className="space-y-6">
                        {meetingData.summary && (
                          <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                            <h3 className="text-lg font-bold text-[#111111] mb-3">
                              Meeting Summary
                            </h3>
                            <p className="text-sm text-[#5A5A5A] leading-relaxed">
                              {meetingData.summary}
                            </p>
                          </div>
                        )}

                        {!userChecked ? (
                          <div className="bg-white border border-black/[0.08] rounded-[24px] p-6 shadow-xs animate-pulse">
                            <div className="h-4 bg-[#F4EFE5] rounded w-1/4 mb-4" />
                            <div className="space-y-2">
                              <div className="h-3 bg-[#F4EFE5] rounded w-3/4" />
                              <div className="h-3 bg-[#F4EFE5] rounded w-1/2" />
                            </div>
                          </div>
                        ) : (
                          <>
                            {isOwner && displayActionItems.length > 0 && (
                              <ActionItems
                                actionItems={displayActionItems}
                                onDeleteItem={deleteActionItem}
                                onAddItem={addActionItem}
                                meetingId={meetingId}
                              />
                            )}

                            {!isOwner && displayActionItems.length > 0 && (
                              <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                                <h3 className="text-lg font-bold text-[#111111] mb-4">
                                  Action Items
                                </h3>
                                <div className="space-y-3">
                                  {displayActionItems.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-start gap-3"
                                    >
                                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A0A] mt-1.5 shrink-0" />
                                      <p className="text-sm text-[#111111] font-medium">
                                        {item.text}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 text-center shadow-xs">
                        <div className="w-7 h-7 rounded-full border-2 border-[#FF5A0A] border-t-transparent animate-spin mx-auto mb-3" />
                        <p className="text-sm font-bold text-[#111111]">
                          Processing meeting with AI...
                        </p>
                        <p className="text-xs text-[#808080] mt-1">
                          You'll receive an email notification when processing completes.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'transcript' && (
                  <div>
                    {loading ? (
                      <div className="bg-white border border-black/[0.08] rounded-[24px] p-8 text-center shadow-xs">
                        <div className="w-7 h-7 rounded-full border-2 border-[#FF5A0A] border-t-transparent animate-spin mx-auto mb-3" />
                        <p className="text-sm text-[#5A5A5A]">Loading transcript...</p>
                      </div>
                    ) : meetingData?.transcript ? (
                      <TranscriptDisplay transcript={meetingData.transcript} />
                    ) : (
                      <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 text-center shadow-xs">
                        <p className="text-sm text-[#5A5A5A]">
                          No transcript available for this meeting.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Chat Assistant */}
          {!userChecked ? (
            <div className="w-full lg:w-96 bg-white rounded-[24px] border border-black/[0.08] p-6 shadow-xs animate-pulse">
              <div className="h-4 bg-[#F4EFE5] rounded w-1/2 mb-4" />
              <div className="space-y-3">
                <div className="h-8 bg-[#F4EFE5] rounded" />
                <div className="h-8 bg-[#F4EFE5] rounded" />
              </div>
            </div>
          ) : (
            isOwner && (
              <div className="w-full lg:w-96 shrink-0">
                <ChatSidebar
                  messages={messages}
                  chatInput={chatInput}
                  showSuggestions={showSuggestions}
                  onInputChange={handleInputChange}
                  onSendMessage={handleSendMessage}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
            )
          )}
        </div>

        {/* Audio Player Full Width across entire page width */}
        <CustomAudioPlayer
          recordingUrl={meetingData?.recordingUrl}
          meetingId={meetingId}
          isOwner={isOwner}
        />
      </motion.div>
    </div>
  )
}

export default MeetingDetail
