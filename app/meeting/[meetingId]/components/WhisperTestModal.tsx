'use client'

import React, { useCallback, useRef, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCopy,
  ClipboardCheck,
  FileAudio,
  Loader2,
  Mic,
  Upload,
  X,
  Zap,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WhisperSegment {
  speaker: string
  offset: number
  words: { word: string; start: number; end: number }[]
  text: string
}

interface TranscriptionResult {
  text: string
  language?: string
  duration?: number
  segments: WhisperSegment[]
}

type Stage = 'idle' | 'dragging' | 'uploading' | 'transcribing' | 'done' | 'error'

interface WhisperTestModalProps {
  isOpen: boolean
  onClose: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = '.mp3,.mp4,.wav,.m4a,.webm,.ogg,.flac'
const MAX_MB = 25

function formatDuration(seconds?: number) {
  if (!seconds) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WhisperTestModal({ isOpen, onClose }: WhisperTestModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [stage, setStage] = useState<Stage>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<TranscriptionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'segments' | 'raw'>('segments')

  // ── File validation ──────────────────────────────────────────────────────────

  function validateFile(file: File): string | null {
    if (file.size > MAX_MB * 1024 * 1024) {
      return `File is too large (${formatBytes(file.size)}). Max is ${MAX_MB} MB.`
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const allowed = ['mp3', 'mp4', 'wav', 'm4a', 'webm', 'ogg', 'flac']
    if (!allowed.includes(ext)) {
      return `Unsupported format ".${ext}". Use: MP3, MP4, WAV, M4A, WebM, OGG or FLAC.`
    }
    return null
  }

  function pickFile(file: File) {
    const err = validateFile(file)
    if (err) {
      setError(err)
      setStage('error')
      return
    }
    setSelectedFile(file)
    setStage('idle')
    setError(null)
    setResult(null)
  }

  // ── Drag & drop ─────────────────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setStage('dragging')
  }, [])

  const handleDragLeave = useCallback(() => {
    setStage((prev) => (prev === 'dragging' ? 'idle' : prev))
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) pickFile(file)
    else setStage('idle')
  }, [])

  // ── Transcribe ───────────────────────────────────────────────────────────────

  async function handleTranscribe() {
    if (!selectedFile) return

    setStage('uploading')
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('audio', selectedFile)

      setStage('transcribing')

      const res = await fetch('/api/whisper/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Transcription failed. Please try again.')
      }

      setResult(data)
      setStage('done')
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.')
      setStage('error')
    }
  }

  // ── Copy ─────────────────────────────────────────────────────────────────────

  function handleCopy() {
    if (!result?.text) return
    navigator.clipboard.writeText(result.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Reset ────────────────────────────────────────────────────────────────────

  function handleReset() {
    setStage('idle')
    setSelectedFile(null)
    setResult(null)
    setError(null)
    setCopied(false)
  }

  // ── Close guard ──────────────────────────────────────────────────────────────

  function handleClose() {
    if (stage === 'uploading' || stage === 'transcribing') return // block while busy
    handleReset()
    onClose()
  }

  if (!isOpen) return null

  const isBusy = stage === 'uploading' || stage === 'transcribing'

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-[28px] border border-black/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.18)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-black/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[#FFF2EA] border border-[#FF5A0A]/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-[#FF5A0A]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111111] tracking-tight leading-none">
                Whisper STT Test
              </h2>
              <p className="text-xs text-[#808080] mt-0.5 font-medium">
                Powered by OpenAI Whisper · Max 25 MB
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isBusy}
            className="w-8 h-8 rounded-full bg-[#F4EFE5] hover:bg-[#EDEAE3] flex items-center justify-center text-[#5A5A5A] transition-all disabled:opacity-40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">

          {/* ── Drop zone ── */}
          {!result && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isBusy && fileInputRef.current?.click()}
              className={`
                relative rounded-[20px] border-2 border-dashed transition-all duration-200 cursor-pointer
                flex flex-col items-center justify-center gap-3 py-10 px-6
                ${stage === 'dragging'
                  ? 'border-[#FF5A0A] bg-[#FFF2EA]'
                  : selectedFile
                    ? 'border-[#FF5A0A]/40 bg-[#FFF9F6]'
                    : 'border-black/[0.12] bg-[#FAFAF9] hover:border-[#FF5A0A]/40 hover:bg-[#FFF9F6]'}
                ${isBusy ? 'pointer-events-none opacity-60' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) pickFile(f)
                  e.target.value = ''
                }}
              />

              {selectedFile ? (
                <>
                  <div className="w-12 h-12 rounded-[16px] bg-[#FFF2EA] border border-[#FF5A0A]/20 flex items-center justify-center">
                    <FileAudio className="w-6 h-6 text-[#FF5A0A]" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm text-[#111111] truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[#808080] mt-0.5">
                      {formatBytes(selectedFile.size)} · {selectedFile.type || 'audio'}
                    </p>
                  </div>
                  <p className="text-xs text-[#FF5A0A] font-medium">
                    Click or drop to change file
                  </p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-[16px] bg-[#F4EFE5] border border-black/[0.08] flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#808080]" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm text-[#111111]">
                      Drop your audio file here
                    </p>
                    <p className="text-xs text-[#808080] mt-1">
                      or click to browse · MP3, MP4, WAV, M4A, WebM, OGG, FLAC
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Error banner ── */}
          {stage === 'error' && error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-[16px] p-4">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 font-medium leading-snug">{error}</p>
            </div>
          )}

          {/* ── Progress states ── */}
          {(stage === 'uploading' || stage === 'transcribing') && (
            <div className="flex flex-col items-center gap-4 py-8">
              {/* Animated ring */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#F4EFE5]" />
                <div className="absolute inset-0 rounded-full border-4 border-[#FF5A0A] border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-[#FF5A0A]" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-[#111111] text-sm">
                  {stage === 'uploading' ? 'Uploading audio…' : 'Transcribing with Whisper…'}
                </p>
                <p className="text-xs text-[#808080] mt-1">
                  {stage === 'transcribing'
                    ? 'This may take 10–60 seconds depending on file length'
                    : 'Sending file to server…'}
                </p>
              </div>
              {/* Animated dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#FF5A0A] animate-bounce"
                    style={{ animationDelay: `${i * 0.12}s`, animationDuration: '0.8s' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Result ── */}
          {stage === 'done' && result && (
            <div className="space-y-4">
              {/* Success header + meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#18A957]" />
                  <span className="text-sm font-bold text-[#18A957]">
                    Transcription complete
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#808080] font-medium">
                  {result.language && (
                    <span className="bg-[#F4EFE5] px-2.5 py-1 rounded-full border border-black/[0.08] uppercase tracking-wide">
                      {result.language}
                    </span>
                  )}
                  {result.duration && (
                    <span className="bg-[#F4EFE5] px-2.5 py-1 rounded-full border border-black/[0.08]">
                      {formatDuration(result.duration)}
                    </span>
                  )}
                  {result.segments.length > 0 && (
                    <span className="bg-[#F4EFE5] px-2.5 py-1 rounded-full border border-black/[0.08]">
                      {result.segments.length} segments
                    </span>
                  )}
                </div>
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-[#F4EFE5] rounded-[12px] p-1 w-fit">
                <button
                  onClick={() => setViewMode('segments')}
                  className={`px-4 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'segments'
                      ? 'bg-white text-[#111111] shadow-sm'
                      : 'text-[#808080] hover:text-[#5A5A5A]'
                  }`}
                >
                  Segments
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-4 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'raw'
                      ? 'bg-white text-[#111111] shadow-sm'
                      : 'text-[#808080] hover:text-[#5A5A5A]'
                  }`}
                >
                  Raw Text
                </button>
              </div>

              {/* Segments view */}
              {viewMode === 'segments' && result.segments.length > 0 && (
                <div className="bg-[#FAFAF9] rounded-[20px] border border-black/[0.08] p-5 space-y-4 max-h-72 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {result.segments.map((seg, i) => (
                    <div
                      key={i}
                      className="pb-4 border-b border-black/[0.06] last:border-0 last:pb-0 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111111]">{seg.speaker}</span>
                        <span className="text-[11px] font-semibold bg-[#FFF2EA] text-[#FF5A0A] px-2 py-0.5 rounded-full border border-[#FF5A0A]/20">
                          {formatDuration(seg.offset)}
                        </span>
                      </div>
                      <p className="text-sm text-[#5A5A5A] leading-relaxed pl-3.5 border-l-2 border-[#FF5A0A]/30">
                        {seg.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Raw text view */}
              {viewMode === 'raw' && (
                <div className="bg-[#FAFAF9] rounded-[20px] border border-black/[0.08] p-5 max-h-72 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <p className="text-sm text-[#111111] leading-relaxed whitespace-pre-wrap font-mono">
                    {result.text}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="shrink-0 px-7 py-5 border-t border-black/[0.06] flex items-center justify-between gap-3">

          {/* Left: word count or file info */}
          <div className="text-xs text-[#808080] font-medium">
            {result
              ? `${result.text.trim().split(/\s+/).filter(Boolean).length} words`
              : selectedFile
                ? `${formatBytes(selectedFile.size)} selected`
                : 'No file selected'}
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Reset / try another */}
            {(stage === 'done' || stage === 'error') && (
              <button
                onClick={handleReset}
                className="h-[40px] px-4 rounded-[12px] bg-[#F4EFE5] hover:bg-[#EDEAE3] text-[#5A5A5A] text-xs font-semibold border border-black/[0.08] transition-all cursor-pointer"
              >
                Try Another File
              </button>
            )}

            {/* Copy button */}
            {stage === 'done' && result && (
              <button
                onClick={handleCopy}
                className="h-[40px] px-4 rounded-[12px] bg-[#F4EFE5] hover:bg-[#FFF2EA] text-xs font-semibold border border-black/[0.08] hover:border-[#FF5A0A]/30 hover:text-[#FF5A0A] transition-all flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="w-4 h-4 text-[#18A957]" />
                    <span className="text-[#18A957]">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardCopy className="w-4 h-4" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            )}

            {/* Main CTA */}
            {stage !== 'done' && (
              <button
                onClick={handleTranscribe}
                disabled={!selectedFile || isBusy}
                className="h-[40px] px-5 rounded-[12px] bg-[#0F0F10] hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{stage === 'uploading' ? 'Uploading…' : 'Transcribing…'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Transcribe with Whisper</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
