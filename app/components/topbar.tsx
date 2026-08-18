'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { ChevronRight, Menu } from 'lucide-react'

interface TopbarProps {
  onMobileMenuToggle?: () => void
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const pathname = usePathname()
  const { user } = useUser()

  const getPageTitle = (path: string) => {
    if (path.startsWith('/home')) return 'Dashboard'
    if (path.startsWith('/integrations')) return 'Integrations'
    if (path.startsWith('/settings')) return 'Settings'
    if (path.startsWith('/chat')) return 'Chat with AI'
    if (path.startsWith('/pricing')) return 'Pricing'
    if (path.startsWith('/meeting/')) return 'Meeting Details'
    return 'Dashboard'
  }

  const title = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-40 mb-4 w-full pt-1">
      <div className="bg-white/90 backdrop-blur-md border border-black/[0.08] rounded-[20px] shadow-[0_10px_35px_rgba(0,0,0,0.04)] px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
        
        {/* Left: Title & Breadcrumb */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl border border-black/[0.08] bg-[#F8F6F1] text-[#111111] hover:bg-[#FFF2EA] hover:text-[#FF5A0A] transition-colors cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-sm sm:text-base text-[#5A5A5A] font-medium">
              <Link href="/" className="font-semibold text-[#111111] hover:text-[#FF5A0A] transition-colors cursor-pointer">
                App
              </Link>
              <ChevronRight className="w-4 h-4 text-[#808080]" />
              <span className="font-semibold text-[#FF5A0A] tracking-[-0.02em]">{title}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-sm font-semibold text-[#111111] tracking-[-0.02em]">
              {user?.fullName || 'User'}
            </span>
            <span className="text-xs text-[#808080]">
              {user?.primaryEmailAddress?.emailAddress || ''}
            </span>
          </div>

          <div className="flex shrink-0">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10 rounded-full',
                },
              }}
            />
          </div>
        </div>

      </div>
    </header>
  )
}
