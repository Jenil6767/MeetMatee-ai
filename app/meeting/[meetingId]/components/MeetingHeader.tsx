'use client'

import { Check, Eye, Share2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface MeetingHeaderProps {
  title: string
  meetingId?: string
  summary?: string
  actionItems?: string
  isOwner: boolean
  isLoading?: boolean
}

function MeetingHeader({
  title,
  meetingId,
  summary,
  actionItems,
  isOwner,
  isLoading = false,
}: MeetingHeaderProps) {
  const [isPosting, setIsPosting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handlePostToSlack = async () => {
    if (!meetingId) return

    try {
      setIsPosting(true)
      toast('✅ Posted to Slack', {
        action: { label: 'OK', onClick: () => {} },
      })
      await fetch('/api/slack/post-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId,
          summary: summary || 'Meeting summary not available',
          actionItems: actionItems || 'No action items recorded',
        }),
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleShare = async () => {
    if (!meetingId) return

    try {
      const shareUrl = `${window.location.origin}/meeting/${meetingId}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast('✅ Meeting link copied!', {
        action: { label: 'OK', onClick: () => {} },
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleDelete = async () => {
    if (!meetingId) return

    try {
      setIsDeleting(true)
      toast('✅ Meeting Deleted', {
        action: { label: 'OK', onClick: () => {} },
      })
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        router.push('/home')
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-[24px] border border-black/[0.08] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-wrap items-center justify-between gap-4 mb-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
        {title}
      </h1>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs font-medium text-[#808080]">
          <div className="w-4 h-4 rounded-full border-2 border-[#FF5A0A] border-t-transparent animate-spin" />
          Loading...
        </div>
      ) : isOwner ? (
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePostToSlack}
            disabled={isPosting || !meetingId}
            type="button"
            className="inline-flex items-center gap-2 h-[40px] px-4 bg-white border border-black/[0.12] hover:bg-[#F8F6F1] text-[#111111] text-xs font-semibold rounded-[12px] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <img src="/slack.png" alt="Slack" className="w-4 h-4" />
            <span>{isPosting ? 'Posting...' : 'Post to Slack'}</span>
          </button>

          <button
            onClick={handleShare}
            type="button"
            className="inline-flex items-center gap-2 h-[40px] px-4 bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#5A5A5A] hover:text-[#FF5A0A] border border-black/[0.08] text-xs font-semibold rounded-[12px] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#18A957]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            type="button"
            className="inline-flex items-center gap-2 h-[40px] px-4 bg-[#E5484D] hover:bg-[#d43f44] text-white text-xs font-semibold rounded-[12px] transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F8F6F1] text-[#5A5A5A] px-3 py-1.5 rounded-full border border-black/[0.08]">
          <Eye className="w-4 h-4 text-[#FF5A0A]" />
          <span>Viewing shared meeting</span>
        </div>
      )}
    </div>
  )
}

export default MeetingHeader
