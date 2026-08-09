'use client'

import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import React, { useRef, useState } from 'react'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

interface CustomAudioPlayerProps {
  recordingUrl?: string
  isOwner?: boolean
}

function CustomAudioPlayer({
  recordingUrl,
  isOwner = true,
}: CustomAudioPlayerProps) {
  const playerRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)

  if (!recordingUrl) {
    return null
  }

  const handlePlayPause = () => {
    const audio = playerRef.current?.audio?.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  const handleSkipBack = () => {
    const audio = playerRef.current?.audio?.current
    if (!audio) return
    audio.currentTime = Math.max(0, audio.currentTime - 10)
  }

  const handleSkipForward = () => {
    const audio = playerRef.current?.audio?.current
    if (!audio) return
    audio.currentTime = Math.min(duration, audio.currentTime + 10)
  }

  const handleProgressClick = (e: any) => {
    const audio = playerRef.current?.audio?.current
    if (!audio || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration

    audio.currentTime = newTime
  }

  const handleVolumeChange = (e: any) => {
    const audio = playerRef.current?.audio?.current
    if (!audio) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newVolume = Math.max(0, Math.min(1, clickX / width))

    audio.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full mt-6">
      <div style={{ display: 'none' }}>
        <AudioPlayer
          ref={playerRef}
          src={recordingUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onListen={(e) => {
            const audio = e.target as HTMLAudioElement
            if (audio && audio.currentTime) {
              setCurrentTime(audio.currentTime)
            }
          }}
          onLoadedMetaData={(e) => {
            const audio = e.target as HTMLAudioElement
            if (audio && audio.duration) {
              setDuration(audio.duration)
            }
          }}
          volume={volume}
          hasDefaultKeyBindings={true}
          autoPlayAfterSrcChange={false}
          showSkipControls={false}
          showJumpControls={false}
          showDownloadProgress={false}
          showFilledProgress={false}
        />
      </div>

      <div className="bg-white rounded-[24px] border border-black/[0.08] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] w-full">
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSkipBack}
              type="button"
              className="w-9 h-9 rounded-[12px] bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#5A5A5A] hover:text-[#FF5A0A] border border-black/[0.08] flex items-center justify-center transition-all cursor-pointer"
              title="Rewind 10s"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={handlePlayPause}
              type="button"
              className="w-11 h-11 rounded-full bg-[#0F0F10] hover:bg-black text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-xs"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={handleSkipForward}
              type="button"
              className="w-9 h-9 rounded-[12px] bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#5A5A5A] hover:text-[#FF5A0A] border border-black/[0.08] flex items-center justify-center transition-all cursor-pointer"
              title="Forward 10s"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Progress Bar & Timers */}
          <div className="flex-1 flex items-center gap-3 min-w-[200px]">
            <span className="text-xs font-semibold text-[#808080] min-w-[36px]">
              {formatTime(currentTime)}
            </span>

            <div
              className="flex-1 bg-[#F4EFE5] rounded-full h-2.5 cursor-pointer relative overflow-hidden"
              onClick={handleProgressClick}
            >
              <div
                className="bg-[#FF5A0A] h-full rounded-full transition-all duration-300"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            <span className="text-xs font-semibold text-[#808080] min-w-[36px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Volume & Status */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-[#808080]" />
              <div
                className="w-20 bg-[#F4EFE5] rounded-full h-2.5 cursor-pointer relative overflow-hidden"
                onClick={handleVolumeChange}
              >
                <div
                  className="bg-[#FF5A0A] h-full rounded-full"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>

            <span className="text-xs font-bold bg-[#FFF2EA] text-[#FF5A0A] px-3 py-1 rounded-full border border-[#FF5A0A]/20">
              Meeting Audio
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomAudioPlayer
