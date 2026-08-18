'use client'

import React from 'react'
import { PastMeeting } from '../hooks/useMeetings'
import { Clock, ExternalLink, Video } from 'lucide-react'
import AttendeeAvatars from './AttendeeAvatars'
import { format } from 'date-fns'

interface PastMeetingsProps {
  pastMeetings: PastMeeting[]
  pastLoading: boolean
  onMeetingClick: (id: string) => void
  getAttendeeList: (attendees: any) => string[]
  getInitials: (name: string) => string
  currentPage: number
  totalPages: number
  totalMeetings: number
  onPageChange: (page: number) => void
}

function PastMeetings({
  pastMeetings,
  pastLoading,
  onMeetingClick,
  getAttendeeList,
  getInitials,
  currentPage,
  totalPages,
  totalMeetings,
  onPageChange,
}: PastMeetingsProps) {
  if (pastLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[24px] border border-black/[0.08] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] animate-pulse"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-[#F4EFE5] rounded-lg w-56" />
              <div className="h-6 bg-[#F4EFE5] rounded-full w-24" />
            </div>
            <div className="h-4 bg-[#F4EFE5] rounded w-3/4 mb-3" />
            <div className="h-4 bg-[#F4EFE5] rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (!pastLoading && totalMeetings === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px] bg-white rounded-[28px] border border-black/[0.07] shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-12 text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#FFF2EA] to-[#FFE5D4] flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(255,90,10,0.12)] border border-[#FF5A0A]/10">
          <Video className="h-9 w-9 text-[#FF5A0A]" />
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-[#111111] tracking-[-0.03em] mb-2">
          No Meetings Yet
        </h3>
        <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] leading-relaxed max-w-xs">
          You don't have any recorded meetings yet. Once your AI bot joins a call, your summaries, transcripts, and action items will appear here.
        </p>

        {/* Decorative dots */}
        <div className="flex items-center gap-1.5 mt-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]/30" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A]/30" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {pastMeetings.length === 0 ? (
        /* Empty state — white card, centered, no pagination */
        <div className="bg-white rounded-[24px] border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.05)] p-12 flex flex-col items-center justify-center min-h-[280px] text-center">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#FFF2EA] to-[#FFE5D4] flex items-center justify-center mb-4 shadow-[0_8px_24px_rgba(255,90,10,0.10)] border border-[#FF5A0A]/10">
            <Video className="h-8 w-8 text-[#FF5A0A]" />
          </div>
          <h3 className="text-lg font-bold text-[#111111] tracking-[-0.02em] mb-1.5">
            No Past Meetings
          </h3>
          <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] leading-relaxed max-w-xs">
            Your completed meetings and AI summaries will appear here once processed.
          </p>
        </div>
      ) : (
        <>
          {pastMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-[24px] border border-black/[0.08] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-[#111111] tracking-[-0.02em]">
                    {meeting.title}
                  </h3>
                  {meeting.attendees && (
                    <AttendeeAvatars
                      attendees={meeting.attendees}
                      getAttendeeList={getAttendeeList}
                      getInitials={getInitials}
                    />
                  )}
                </div>
                <span className="shrink-0 text-xs font-semibold bg-[#18A957]/10 text-[#18A957] px-3 py-1 rounded-full border border-[#18A957]/20">
                  Completed
                </span>
              </div>

              {meeting.description && (
                <p className="text-sm text-[#5A5A5A] mb-4 font-normal tracking-[-0.01em] leading-[1.6] line-clamp-2">
                  {meeting.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.06] text-xs text-[#808080]">
                <div className="flex items-center gap-2 font-medium">
                  <Clock className="h-4 w-4 text-[#FF5A0A]" />
                  <span>
                    {format(new Date(meeting.startTime), 'PPp')} -{' '}
                    {format(new Date(meeting.endTime), 'pp')}
                  </span>
                </div>

                <button
                  onClick={() => onMeetingClick(meeting.id)}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F0F10] text-white hover:bg-black text-xs font-semibold rounded-[10px] transition-all hover:scale-105 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}

          {/* Pagination Controls — only shown when meetings exist */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[#808080] font-medium">
                Showing page {currentPage} of {totalPages} &middot; {totalMeetings} total meetings
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] border border-black/[0.1] bg-white text-[#111] text-xs font-semibold hover:bg-[#F4EFE5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={[
                      'inline-flex items-center justify-center w-8 h-8 rounded-[10px] text-xs font-semibold transition-all',
                      page === currentPage
                        ? 'bg-[#FF5A0A] text-white shadow-sm'
                        : 'border border-black/[0.1] bg-white text-[#111] hover:bg-[#F4EFE5]',
                    ].join(' ')}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[10px] border border-black/[0.1] bg-white text-[#111] text-xs font-semibold hover:bg-[#F4EFE5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PastMeetings
