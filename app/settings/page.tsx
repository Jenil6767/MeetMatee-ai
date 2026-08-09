'use client'

import { SignOutButton, useAuth, useUser } from '@clerk/nextjs'
import { Bot, Check, LogOut, Save, Upload, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function Settings() {
  const { user } = useUser()
  const { userId } = useAuth()
  const [botName, setBotName] = useState('Meeting Bot')
  const [botImageUrl, setBotImageUrl] = useState<string | null>(null)
  const [userPlan, setUserPlan] = useState('free')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchBotSettings()
    }
  }, [userId])

  const fetchBotSettings = async () => {
    try {
      const response = await fetch('/api/user/bot-settings')
      if (response.ok) {
        const data = await response.json()
        setBotName(data.botName || 'Meeting Bot')
        setBotImageUrl(data.botImageUrl || null)
        setUserPlan(data.plan || 'free')
      }
    } catch (error) {
      console.error('error fetching bot settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBotNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotName(e.target.value)
    setHasChanges(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/upload/bot-avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setBotImageUrl(data.url)
        setHasChanges(true)
      } else {
        console.error('image upload failed:', data.error)
      }
    } catch (error) {
      console.error('image upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const saveBotSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/bot-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botName,
          botImageUrl,
        }),
      })

      if (response.ok) {
        setHasChanges(false)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (error) {
      console.error('error saving bot settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getPlanDisplayName = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'free':
        return 'Free Plan'
      case 'starter':
        return 'Starter Plan'
      case 'pro':
        return 'Pro Plan'
      case 'premium':
        return 'Premium Plan'
      default:
        return 'Free Plan'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF5A0A] border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-medium text-[#5A5A5A]">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="space-y-8"
      >
        {/* Subheader */}
        <div>
          <h2 className="text-2xl font-bold text-[#111111] tracking-[-0.03em] mb-1">
            Account & Bot Settings
          </h2>
          <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
            Manage your personal profile, plan subscription, and AI meeting bot identity.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-6 border-b border-black/[0.06]">
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shrink-0 ring-4 ring-[#FFF2EA] shadow-xs">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#FFF2EA] flex items-center justify-center text-[#FF5A0A]">
                    <User className="h-8 w-8 sm:h-9 sm:w-9" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-[#111111] truncate">
                  {user?.fullName || 'User Account'}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] mt-0.5 truncate">
                  {user?.primaryEmailAddress?.emailAddress || 'No email associated'}
                </p>
              </div>
            </div>

            <span className="shrink-0 text-xs font-semibold bg-[#FFF2EA] text-[#FF5A0A] px-3.5 py-1.5 rounded-full border border-[#FF5A0A]/20 whitespace-nowrap">
              {getPlanDisplayName(userPlan)}
            </span>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[#808080]">
            <span className="font-normal tracking-[-0.01em]">Account ID: {user?.id ? `${user.id.slice(0, 14)}...` : 'Active'}</span>
            <span className="text-[#18A957] font-semibold">● Active Member</span>
          </div>
        </div>

        {/* Bot Customization Card */}
        <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[#111111] tracking-[-0.02em] mb-1">
              Bot Customization
            </h3>
            <p className="text-xs text-[#5A5A5A] font-normal tracking-[-0.01em]">
              Customize the name and avatar of the AI bot that joins your meetings.
            </p>
          </div>

          {/* Bot Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="bot-name"
              className="block text-xs font-medium uppercase tracking-wider text-[#5A5A5A]"
            >
              Bot Display Name
            </label>
            <input
              id="bot-name"
              type="text"
              value={botName}
              onChange={handleBotNameChange}
              placeholder="Enter Bot Name..."
              className="w-full h-[52px] rounded-[16px] border border-black/[0.12] bg-[#F8F6F1] px-4 text-sm font-medium text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF5A0A] transition-all"
            />
          </div>

          {/* Bot Avatar Uploader */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-[#5A5A5A]">
              Bot Avatar Icon
            </label>

            <div className="flex items-center gap-5 pt-1">
              <div className="w-20 h-20 rounded-full bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center overflow-hidden shrink-0 border border-black/[0.06] shadow-xs">
                {botImageUrl ? (
                  <img
                    src={botImageUrl}
                    alt="Bot Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Bot className="h-9 w-9" />
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  id="bot-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />

                <label
                  htmlFor="bot-image-upload"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 bg-[#F8F6F1] hover:bg-[#FFF2EA] text-[#111111] hover:text-[#FF5A0A] border border-black/[0.08] text-xs font-semibold rounded-[14px] transition-all cursor-pointer ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="h-4 w-4 text-[#FF5A0A]" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Avatar'}</span>
                </label>

                <p className="text-[11px] text-[#808080] font-normal tracking-[-0.01em]">
                  Supported formats: JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="pt-2">
              <button
                onClick={saveBotSettings}
                disabled={isSaving}
                className="inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white text-sm font-semibold h-[52px] px-8 rounded-[16px] shadow-sm hover:-translate-y-[2px] transition-all cursor-pointer"
              >
                <div className="w-6 h-6 rounded-[6px] bg-[#FF5A0A] flex items-center justify-center mr-2 text-white shrink-0">
                  <Save className="w-3.5 h-3.5" />
                </div>
                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-[#18A957]/10 border border-[#18A957]/20 text-[#18A957] rounded-[14px] text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Bot settings updated successfully!</span>
            </div>
          )}

          {/* Sign Out Action */}
          <div className="pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold tracking-[-0.02em] text-[#111111]">Account Sign Out</h4>
              <p className="text-xs text-[#808080] font-normal tracking-[-0.01em]">Sign out of your session on this browser</p>
            </div>

            <SignOutButton>
              <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E5484D] hover:bg-[#d43f44] text-white text-xs font-semibold rounded-[14px] transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0">
                <LogOut className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings
