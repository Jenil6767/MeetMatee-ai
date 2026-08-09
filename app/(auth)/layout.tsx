'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-screen w-screen overflow-hidden flex"
      style={{
        background: 'radial-gradient(ellipse at top, #F3E9CC 0%, #F8F6F1 50%, #F8F6F1 100%)',
      }}
    >
      {/* ── LEFT PANEL (Auth Card) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center h-full p-4 sm:p-6 lg:p-8">
        <div className="no-scrollbar overflow-y-auto w-full max-w-[430px] py-2">
          {children}
        </div>
      </div>

      {/* ── RIGHT PANEL (Full Right Edge Cover with Inner Rounded Corners) ── */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-center items-stretch shrink-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-full h-full overflow-hidden flex flex-col justify-center p-8 sm:p-12 xl:p-16 shadow-2xl"
          style={{
            background:
              'radial-gradient(ellipse at top right, #FF7A30 0%, #FF5A0A 40%, #D94000 80%, #8A2400 100%)',
          }}
        >
          {/* Fluid organic background waves */}
          <div
            className="absolute inset-0 pointer-events-none opacity-35"
            style={{
              background:
                'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.35) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 90, 10, 0.6) 0%, transparent 60%)',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Text Content Container */}
          <div className="relative z-10 max-w-[520px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-[12px] font-semibold tracking-wide border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-white" />
              <span>AI-POWERED MEETING INTELLIGENCE</span>
            </div>

            <h2
              className="font-bold text-white leading-[1.08] tracking-[-0.03em] mb-6"
              style={{
                fontFamily: 'var(--font-bricolage), system-ui, sans-serif',
                fontSize: 'clamp(36px, 4.2vw, 54px)',
              }}
            >
              Your meetings, <br />
              intelligently handled.
            </h2>

            <p className="text-[16px] xl:text-[18px] text-white/85 font-normal leading-[1.65] tracking-[-0.01em]">
              MeetMatee auto-joins your calls, transcribes conversations, extracts key decisions, and syncs action items directly to your tools - so you can stay focused.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
