'use client'

import React from 'react'

interface TranscriptWord {
  word: string
  start: number
  end: number
}

interface TranscriptSegment {
  words: TranscriptWord[]
  offset: number
  speaker: string
}

interface TranscriptDisplayProps {
  transcript: TranscriptSegment[]
}

export default function TranscriptDisplay({ transcript }: TranscriptDisplayProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getSpeakerSegmentTime = (segment: TranscriptSegment) => {
    const startTime = segment.offset
    const endTime = segment.words[segment.words.length - 1]?.end || segment.offset
    return `${formatTime(startTime)} - ${formatTime(endTime)}`
  }

  const getSegmentText = (segment: TranscriptSegment) => {
    return segment.words.map((word) => word.word).join(' ')
  }

  if (!transcript || transcript.length === 0) {
    return (
      <div className="bg-white rounded-[24px] p-8 border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-center">
        <p className="text-sm font-medium text-[#5A5A5A]">No transcript available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[24px] p-8 border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      <h3 className="text-lg font-bold text-[#111111] mb-6 tracking-tight">
        Meeting Transcript
      </h3>

      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {transcript.map((segment, index) => (
          <div
            key={index}
            className="pb-5 border-b border-black/[0.06] last:border-b-0 space-y-2"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-[#111111]">
                {segment.speaker}
              </span>
              <span className="text-[11px] font-semibold bg-[#FFF2EA] text-[#FF5A0A] px-2.5 py-0.5 rounded-full border border-[#FF5A0A]/20">
                {getSpeakerSegmentTime(segment)}
              </span>
            </div>
            <p className="text-sm text-[#5A5A5A] leading-relaxed pl-3.5 border-l-2 border-[#FF5A0A]/30">
              {getSegmentText(segment)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}