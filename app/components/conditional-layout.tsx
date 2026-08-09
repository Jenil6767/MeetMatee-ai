'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { AppSidebar } from './app-sidebar'
import { Topbar } from './topbar'
import { AnimatePresence, motion } from 'framer-motion'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isSignedIn } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const isPublicRoute =
    pathname === '/' ||
    pathname === '/privacy-policy' ||
    pathname === '/terms' ||
    pathname === '/cookie' ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    (pathname.startsWith('/meeting/') && !isSignedIn)

  if (isPublicRoute) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-screen bg-[#F8F6F1] text-[#111111] overflow-x-hidden font-sans">
      {/* Soft warm background glow */}
      <div
        className="fixed top-0 left-0 right-0 h-[800px] pointer-events-none z-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at top, #F3E9CC 0%, #F8F6F1 50%, #F8F6F1 100%)',
        }}
      />

      <div className="relative z-10 flex h-screen w-full overflow-hidden">
        {/* Desktop Collapsible Sidebar */}
        <div className="hidden md:block shrink-0 h-screen sticky top-0 z-30">
          <AppSidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Drawer Modal */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <>
              {/* Dark Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
              />

              {/* Slide Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 z-50 md:hidden"
              >
                <AppSidebar
                  isMobileDrawer={true}
                  onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Workspace View (Independently Scrollable) */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pt-3 pb-6 px-4 md:px-6 md:pl-4">
          <Topbar onMobileMenuToggle={() => setMobileDrawerOpen(true)} />
          <main className="flex-1 w-full flex flex-col">{children}</main>
        </div>
      </div>
    </div>
  )
}