'use client'

import React from 'react'
import { useMeetings } from './hooks/useMeetings'
import { useRouter } from 'next/navigation'
import PastMeetings from './components/PastMeetings'
import UpcomingMeetings from './components/UpcomingMeetings'
import { motion } from 'framer-motion'

function Home() {
  const {
    userId,
    upcomingEvents,
    pastMeetings,
    loading,
    pastLoading,
    connected,
    error,
    botToggles,
    initialLoading,
    currentPage,
    totalPages,
    totalMeetings,
    fetchUpcomingEvents,
    fetchPastMeetings,
    goToPage,
    toggleBot,
    directOAuth,
    getAttendeeList,
    getInitials,
  } = useMeetings()

  const router = useRouter()
  const handleMeetingClick = (meetingId: string) => {
    router.push(`/meeting/${meetingId}`)
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF5A0A] border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-medium text-[#5A5A5A]">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        {/* Main Left Area: Past Meetings */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#111111] tracking-[-0.03em]">
                Past Meetings
              </h2>
              <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
                Review notes, summaries, and action items from your completed meetings
              </p>
            </div>
          </div>

          <PastMeetings
            pastMeetings={pastMeetings}
            pastLoading={pastLoading}
            onMeetingClick={handleMeetingClick}
            getAttendeeList={getAttendeeList}
            getInitials={getInitials}
            currentPage={currentPage}
            totalPages={totalPages}
            totalMeetings={totalMeetings}
            onPageChange={goToPage}
          />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-black/[0.08] self-stretch min-h-[500px]" />

        {/* Right Sidebar Area: Upcoming Meetings & Calendar Widget */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-24">
            <UpcomingMeetings
              upcomingEvents={upcomingEvents}
              connected={connected}
              error={error}
              loading={loading}
              initialLoading={initialLoading}
              botToggles={botToggles}
              onRefresh={fetchUpcomingEvents}
              onToggleBot={toggleBot}
              onConnectCalendar={directOAuth}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
