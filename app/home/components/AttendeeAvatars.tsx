import React from 'react'

interface AttendeeAvatarsProps {
  attendees: any
  getAttendeeList: (attendees: any) => string[]
  getInitials: (name: string) => string
}

function AttendeeAvatars({
  attendees,
  getAttendeeList,
  getInitials,
}: AttendeeAvatarsProps) {
  const attendeeList = getAttendeeList(attendees)

  return (
    <div className="flex -space-x-1.5 items-center">
      {attendeeList.slice(0, 4).map((attendee, index) => (
        <div key={index} className="relative group/avatar">
          {/* Default view: Short Initials only */}
          <div className="w-7 h-7 rounded-full bg-[#0F0F10] text-white border-2 border-white flex items-center justify-center text-[11px] font-bold hover:scale-110 transition-transform cursor-pointer shadow-xs">
            {getInitials(attendee)}
          </div>

          {/* Hover Tooltip: Displays ONLY when THIS specific avatar is hovered */}
          <div className="absolute left-0 bottom-full mb-2 bg-[#0F0F10] text-white text-xs font-semibold px-3 py-1.5 rounded-[10px] shadow-xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
            {attendee}
          </div>
        </div>
      ))}

      {attendeeList.length > 4 && (
        <div
          className="w-7 h-7 rounded-full bg-[#FF5A0A] text-white border-2 border-white flex items-center justify-center text-[11px] font-bold shadow-xs"
          title={`+${attendeeList.length - 4} more`}
        >
          +{attendeeList.length - 4}
        </div>
      )}
    </div>
  )
}

export default AttendeeAvatars
