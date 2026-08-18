'use client'

import { AlertTriangle, Check, Eye, Share2, Trash2, X } from 'lucide-react'
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
      const response = await fetch(`/api/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        toast('✅ Meeting Deleted', {
          action: { label: 'OK', onClick: () => {} },
        })
        router.push('/home')
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <>
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
              onClick={() => setShowDeleteModal(true)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-[28px] border border-black/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.18)] w-full max-w-md p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4EFE5] hover:bg-[#EDEAE3] flex items-center justify-center text-[#5A5A5A] transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-[20px] bg-[#FFF0F0] border border-[#E5484D]/20 flex items-center justify-center mb-5 shadow-[0_8px_24px_rgba(229,72,77,0.12)]">
              <AlertTriangle className="w-8 h-8 text-[#E5484D]" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-[#111111] tracking-[-0.03em] mb-2">
              Delete Meeting?
            </h2>
            <p className="text-sm text-[#5A5A5A] font-normal leading-relaxed mb-7 max-w-xs">
              This will permanently delete the meeting along with its transcript, summary, and all action items. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 h-[48px] rounded-[14px] border border-black/[0.12] bg-[#F8F6F1] hover:bg-[#EDEAE3] text-[#111111] text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-[48px] rounded-[14px] bg-[#E5484D] hover:bg-[#d43f44] text-white text-sm font-semibold transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MeetingHeader
