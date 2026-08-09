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
}

function PastMeetings({
  pastMeetings,
  pastLoading,
  onMeetingClick,
  getAttendeeList,
  getInitials,
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

  if (pastMeetings.length === 0) {
    return (
      <div className="bg-white rounded-[24px] border border-black/[0.08] p-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col items-center">
        <div className="w-14 h-14 rounded-[18px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center mb-4">
          <Video className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-[#111111] tracking-[-0.02em] mb-1">No past meetings</h3>
        <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em]">
          Your completed meetings and AI summaries will appear here once processed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
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
    </div>
  )
}

export default PastMeetings
