'use client'

import React from 'react'
import { useMeetings } from './hooks/useMeetings'
import { useRouter } from 'next/navigation'
import PastMeetings from './components/PastMeetings'
import UpcomingMeetings from './components/UpcomingMeetings'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useEffect } from 'react'
import { useUsage } from '@/app/contexts/UsageContext'
import { toast } from 'sonner'

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
    searchQuery,
    handleSearch,
    clearSearch,
    syncCalendar,
    handleJoinMeeting
  } = useMeetings()

  const router = useRouter()
  const { refreshUsage } = useUsage()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const success = params.get('success')
      const sessionId = params.get('session_id')

      if (success === 'true') {
        const verifySession = async () => {
          if (sessionId) {
            toast.loading('Verifying your payment...', { id: 'verify-payment' })
            try {
              const res = await fetch('/api/stripe/verify-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId })
              })
              
              if (res.ok) {
                toast.success('Subscription Upgraded!', {
                  id: 'verify-payment',
                  description: 'Your new plan is now active.',
                  duration: 5000,
                })
              } else {
                toast.dismiss('verify-payment')
              }
            } catch (error) {
              toast.dismiss('verify-payment')
            }
          } else {
            // Fallback if no session_id
            toast.success('Subscription Upgraded!', {
              description: 'Your new plan is now active.',
              duration: 5000,
            })
          }
          
          refreshUsage()
          window.history.replaceState({}, document.title, window.location.pathname)
        }

        verifySession()
      }
    }
  }, [refreshUsage])

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
    <div className="w-full flex flex-col gap-8">
      {/* Search Bar - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full relative"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#808080]" />
        </div>
        <input
          type="text"
          placeholder="Search meetings by title..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-10 py-3.5 text-[15px] bg-white border border-black/[0.08] rounded-2xl focus:outline-none focus:border-[#FF5A0A] focus:ring-4 focus:ring-[#FF5A0A]/10 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#808080] hover:text-[#111111] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
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
              onSyncCalendar={syncCalendar}
              onJoinMeeting={handleJoinMeeting}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home
