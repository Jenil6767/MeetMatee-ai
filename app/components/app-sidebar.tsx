'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Home,
  Layers3,
  Settings,
  Sparkles,
} from 'lucide-react'
import { useUsage } from '../contexts/UsageContext'

const items = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Integrations',
    url: '/integrations',
    icon: Layers3,
  },
  {
    title: 'Chat with AI',
    url: '/chat',
    icon: Bot,
  },
  {
    title: 'Pricing',
    url: '/pricing',
    icon: DollarSign,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
]

interface AppSidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  isMobileDrawer?: boolean
  onCloseMobileDrawer?: () => void
}

export function AppSidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: AppSidebarProps) {
  const pathname = usePathname()
  const { usage, limits } = useUsage()

  const meetingProgress =
    usage && limits.meetings !== -1
      ? Math.min((usage.meetingsThisMonth / limits.meetings) * 100, 100)
      : 0

  const chatProgress =
    usage && limits.chatMessages !== -1
      ? Math.min((usage.chatMessagesToday / limits.chatMessages) * 100, 100)
      : 0

  const getUpgradeInfo = () => {
    if (!usage) return null

    switch (usage.currentPlan) {
      case 'free':
        return {
          title: 'Upgrade to Starter',
          description: '10 meetings & 30 daily AI messages',
          showButton: true,
        }
      case 'starter':
        return {
          title: 'Upgrade to Pro',
          description: '30 meetings & 100 daily AI messages',
          showButton: true,
        }
      case 'pro':
        return {
          title: 'Upgrade to Premium',
          description: 'Unlimited meetings & chat messages',
          showButton: true,
        }
      case 'premium':
        return {
          title: "You're on Premium!",
          description: 'Unlimited access to all features',
          showButton: false,
        }
      default:
        return {
          title: 'Upgrade Your Plan',
          description: 'Access more features',
          showButton: true,
        }
    }
  }

  const upgradeInfo = getUpgradeInfo()

  return (
    <aside
      className={`sticky top-0 bg-white border border-black/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between transition-all duration-300 z-30 select-none overflow-hidden ${
        isMobileDrawer
          ? 'w-[280px] h-full rounded-r-[24px] rounded-l-none border-l-0'
          : isCollapsed
          ? 'w-[88px] h-screen rounded-r-[24px] rounded-l-none border-l-0'
          : 'w-[280px] h-screen rounded-r-[24px] rounded-l-none border-l-0'
      }`}
    >
      {/* Header & Logo */}
      <div
        className={`p-5 border-b border-black/[0.06] flex items-center ${
          isCollapsed ? 'justify-center p-3.5' : 'justify-between'
        }`}
      >
        {!isCollapsed && (
          <Link
            href="/"
            className="flex items-center gap-2 overflow-hidden cursor-pointer relative z-20"
            onClick={isMobileDrawer ? onCloseMobileDrawer : undefined}
          >
            <Image
              src="/meetMatee.png"
              alt="MeetMatee Logo"
              width={160}
              height={36}
              priority
              unoptimized
              className="h-[32px] w-auto object-contain cursor-pointer"
            />
          </Link>
        )}

        {!isMobileDrawer && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-8 h-8 rounded-full border border-black/[0.08] bg-[#F8F6F1] text-[#5A5A5A] hover:text-[#FF5A0A] hover:bg-[#FFF2EA] flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Navigation List (Scrollbar Hidden) */}
      <div className="flex-1 p-3 space-y-1.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            (item.url === '/home' && pathname.startsWith('/meeting/'))
          const Icon = item.icon

          return (
            <Link
              key={item.title}
              href={item.url}
              onClick={isMobileDrawer ? onCloseMobileDrawer : undefined}
              title={isCollapsed ? item.title : undefined}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-[16px] text-[15px] font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#FF5A0A] text-white shadow-[0_4px_16px_rgba(255,90,10,0.25)]'
                  : 'text-[#5A5A5A] hover:bg-[#FFF2EA] hover:text-[#FF5A0A]'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-[#808080] group-hover:text-[#FF5A0A]'
                }`}
              />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </div>

      {/* Bottom Section: Plan & Upgrade Cards */}
      <div className="p-3 border-t border-black/[0.06] space-y-3 bg-[#F8F6F1]/50">
        {!isCollapsed ? (
          <>
            {/* Usage Summary Card */}
            {usage && (
              <div className="bg-white border border-black/[0.08] rounded-[18px] p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#FF5A0A]">
                    {usage.currentPlan} Plan
                  </span>
                </div>

                {/* Meetings bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[11px] text-[#5A5A5A] font-medium">
                    <span>Meetings</span>
                    <span>
                      {usage.meetingsThisMonth}/{limits.meetings === -1 ? '∞' : limits.meetings}
                    </span>
                  </div>
                  {limits.meetings !== -1 && (
                    <div className="w-full bg-[#F4EFE5] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#FF5A0A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${meetingProgress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Chat messages bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#5A5A5A] font-medium">
                    <span>AI Chat</span>
                    <span>
                      {usage.chatMessagesToday}/{limits.chatMessages === -1 ? '∞' : limits.chatMessages}
                    </span>
                  </div>
                  {limits.chatMessages !== -1 && (
                    <div className="w-full bg-[#F4EFE5] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#FF5A0A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${chatProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Upgrade Promo Card */}
            {upgradeInfo && upgradeInfo.showButton && (
              <div className="bg-[#FFF2EA] border border-[#FF5A0A]/20 rounded-[18px] p-3.5">
                <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#FF5A0A] mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>{upgradeInfo.title}</span>
                </div>
                <p className="text-[11px] text-[#5A5A5A] leading-tight mb-2.5">
                  {upgradeInfo.description}
                </p>
                <Link
                  href="/pricing"
                  onClick={isMobileDrawer ? onCloseMobileDrawer : undefined}
                  className="w-full inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white text-[12px] font-semibold h-[36px] rounded-[12px] transition-all hover:scale-[1.02] shadow-xs"
                >
                  Upgrade Now
                </Link>
              </div>
            )}
          </>
        ) : (
          /* Collapsed View Mini Badge */
          <div className="flex flex-col items-center gap-2 py-2">
            {usage && (
              <div
                title={`Plan: ${usage.currentPlan.toUpperCase()}`}
                className="w-10 h-10 rounded-[12px] bg-[#FFF2EA] text-[#FF5A0A] border border-[#FF5A0A]/20 flex items-center justify-center font-bold text-xs"
              >
                {usage.currentPlan.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}