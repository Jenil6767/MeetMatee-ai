'use client'

import { useUser } from '@clerk/nextjs'
import React from 'react'

interface MeetingData {
  title: string
  date: string
  time: string
  userName: string
}

interface MeetingInfoProps {
  meetingData: MeetingData
}

function MeetingInfo({ meetingData }: MeetingInfoProps) {
  const { user } = useUser()

  return (
    <div className="mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mb-3">
        {meetingData.title}
      </h2>

      <div className="text-xs text-[#5A5A5A] flex items-center gap-4 flex-wrap font-medium">
        <span className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-black/10">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={`${meetingData.userName}'s profile`}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 bg-[#FFF2EA] text-[#FF5A0A] rounded-full flex items-center justify-center font-bold text-[10px]">
                {meetingData.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-[#111111] font-semibold">{meetingData.userName}</span>
        </span>

        <span className="flex items-center gap-1">
          📅 <span>{meetingData.date}</span>
        </span>

        <span className="flex items-center gap-1">
          🕐 <span>{meetingData.time}</span>
        </span>
      </div>
    </div>
  )
}

export default MeetingInfo
