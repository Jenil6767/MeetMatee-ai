import React from 'react'
import { PastMeeting } from '../hooks/useMeetings'
import { Clock, ExternalLink, Video } from 'lucide-react'
import AttendeeAvatars from './AttendeeAvatars'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

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
    getInitials
}: PastMeetingsProps) {

    if (pastLoading) {
        return (
            <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                    <div key={i} className='bg-card rounded-lg p-4 border border-border animate-pulse'>
                        <div className='flex justify-between items-start mb-3'>
                            <div className='flex items-center gap-3 flex-1'>
                                <div className='h-6 bg-muted rounded w-48'></div>
                                <div className='flex -space-x-2'>

                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className='w-6 h-6 rounded-full bg-muted'></div>
                                    ))}
                                </div>

                            </div>
                            <div className='h-5 bg-muted rounded w-20'></div>
                        </div>

                        <div className='h-4 bg-muted rounded w-3/4 mb-3'></div>
                        <div className='h-4 bg-muted rounded w-1/2 mb-3'></div>
                        <div className='h-6 bg-muted rounded w-24'></div>

                    </div>
                ))}

            </div>
        )
    }

    if (pastMeetings.length === 0) {
        return (
            <div className='bg-card rounded-2xl p-10 text-center border border-border shadow-sm'>
                <Video className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
                <h3 className='text-lg font-semibold mb-2 text-foreground'>No past meetings</h3>
                <p className='text-muted-foreground text-sm'>Your completed meetings will appear here</p>
            </div>
        )
    }

    return (
        <div className='space-y-4'>
            {pastMeetings.map((meeting) => (
                <div
                    key={meeting.id}
                    className='bg-card rounded-2xl p-5 border border-border shadow-sm hover:border-[#5B5CEB]/30 hover:shadow-md transition-all duration-200 cursor-pointer'
                    onClick={() => onMeetingClick(meeting.id)}
                >
                    <div className='flex justify-between items-start mb-3'>
                        <div className='flex items-center gap-3 flex-1'>
                            <h3 className='font-semibold text-lg text-foreground'>
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
                        <span className='text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium'>
                            Completed
                        </span>
                    </div>
                    {meeting.description && (
                        <p className='text-sm text-muted-foreground mb-3 leading-relaxed'>{meeting.description}</p>
                    )}

                    <div className='text-sm text-muted-foreground mb-3'>
                        <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-[#5B5CEB]' />
                            <span>
                                {format(new Date(meeting.startTime), 'PPp')} - {format(new Date(meeting.endTime), 'pp')}
                            </span>
                        </div>
                    </div>

                    <div
                        className='flex gap-2 mt-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            className='flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5B5CEB] hover:bg-[#4F46E5] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors h-8 cursor-pointer'
                            onClick={() => onMeetingClick(meeting.id)}
                        >
                            <ExternalLink className='h-3.5 w-3.5' />
                            View Details
                        </Button>

                    </div>

                </div>
            ))}

        </div>
    )
}

export default PastMeetings
