'use client'

import React from 'react'
import { CalendarEvent } from '../hooks/useMeetings'
import { Switch } from '@/components/ui/switch'
import { Calendar, CheckCircle2, Clock, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

interface UpcomingMeetingsProps {
  upcomingEvents: CalendarEvent[]
  connected: boolean
  error: string
  loading: boolean
  initialLoading: boolean
  botToggles: { [key: string]: boolean }
  onRefresh: () => void
  onToggleBot: (eventId: string) => void
  onConnectCalendar: () => void
  onSyncCalendar?: () => void
}

function UpcomingMeetings({
  upcomingEvents,
  connected,
  error,
  loading,
  initialLoading,
  botToggles,
  onRefresh,
  onToggleBot,
  onConnectCalendar,
  onSyncCalendar,
}: UpcomingMeetingsProps) {
  return (
    <div className="space-y-6">
      {/* Calendar Connection Status Card */}
      <div className="bg-white rounded-[24px] border border-black/[0.08] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-[16px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0 border border-[#FF5A0A]/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#111111] tracking-[-0.02em]">
              Google Calendar
            </h3>
            <p className="text-xs text-[#5A5A5A] font-normal tracking-[-0.01em]">Auto-sync meetings with AI bots</p>
          </div>
        </div>

        {connected ? (
          <div className="p-3.5 bg-[#18A957]/10 border border-[#18A957]/20 rounded-[16px] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#18A957]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Calendar Connected</span>
            </div>
            <button
              onClick={onConnectCalendar}
              disabled={loading}
              className="text-[11px] font-semibold text-[#5A5A5A] hover:text-[#FF5A0A] underline cursor-pointer"
            >
              Reconnect
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
              Connect your Google Calendar so AI bots can automatically join and record your scheduled meetings.
            </p>
            <button
              onClick={onConnectCalendar}
              disabled={loading}
              className="w-full h-[46px] bg-[#0F0F10] hover:bg-black text-white text-xs font-semibold rounded-[14px] shadow-sm hover:-translate-y-[2px] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect Google Calendar'}
            </button>
          </div>
        )}
      </div>

      {/* Upcoming Events List Container */}
      <div className="bg-white rounded-[24px] border border-black/[0.08] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between items-center mb-5 pb-4 border-b border-black/[0.06]">
          <div>
            <h3 className="text-base font-semibold text-[#111111] tracking-[-0.02em]">
              Upcoming Meetings
            </h3>
            <p className="text-xs text-[#808080] font-normal tracking-[-0.01em]">Scheduled calendar events</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-[#FFF2EA] text-[#FF5A0A] px-2.5 py-1 rounded-full">
              {upcomingEvents.length} events
            </span>
            <button
              onClick={onSyncCalendar || onRefresh}
              disabled={loading}
              className="p-1.5 bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#5A5A5A] hover:text-[#FF5A0A] rounded-[10px] border border-black/[0.08] transition-colors cursor-pointer"
              title="Sync & Refresh events"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-[#E5484D]/10 border border-[#E5484D]/20 text-[#E5484D] px-4 py-3 rounded-[16px] mb-5 text-xs font-medium">
            {error}
          </div>
        )}

        {initialLoading ? (
          <div className="p-4 animate-pulse text-center space-y-2">
            <div className="h-4 bg-[#F4EFE5] rounded w-3/4 mx-auto" />
            <div className="h-3 bg-[#F4EFE5] rounded w-1/2 mx-auto" />
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 mx-auto bg-[#F8F6F1] rounded-full flex items-center justify-center mb-2 text-base">
              🎉
            </div>
            <h4 className="font-semibold text-[#111111] text-xs mb-1">
              No upcoming meetings
            </h4>
            <p className="text-[#808080] text-[11px]">Your calendar is clear!</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-[#F8F6F1]/60 rounded-[18px] p-4 border border-black/[0.06] hover:bg-[#F8F6F1] transition-all relative"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-bold text-sm text-[#111111] leading-snug">
                    {event.summary || 'Untitled Meeting'}
                  </h4>
                  <div className="shrink-0 flex items-center gap-1.5" title="Toggle AI Bot">
                    <span className="text-[10px] font-semibold text-[#808080]">Bot</span>
                    <Switch
                      checked={!!botToggles[event.id]}
                      onCheckedChange={() => onToggleBot(event.id)}
                      aria-label="Toggle bot for this meeting"
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#5A5A5A] mb-3">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#FF5A0A]" />
                    <span>
                      {format(
                        new Date(event.start?.dateTime || event.start?.date || ''),
                        'MMM d, h:mm a'
                      )}
                    </span>
                  </div>
                  {event.attendees && (
                    <div className="text-[11px] text-[#808080]">
                      👥 {event.attendees.length} attendees
                    </div>
                  )}
                </div>

                {(event.hangoutLink || event.location) && (
                  <a
                    href={event.hangoutLink || event.location || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <button className="w-full h-[34px] bg-[#FF5A0A] hover:bg-[#E94E08] text-white text-xs font-semibold rounded-[10px] transition-all shadow-xs cursor-pointer">
                      Join Meeting
                    </button>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UpcomingMeetings
