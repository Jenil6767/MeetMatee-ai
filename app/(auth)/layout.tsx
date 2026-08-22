'use client'

import { motion } from 'framer-motion'
import { Bot, CheckCircle2, Mic, Share2, Sparkles, Zap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="h-screen w-screen overflow-hidden flex"
      style={{
        background: 'radial-gradient(ellipse at top, #F3E9CC 0%, #F8F6F1 50%, #F8F6F1 100%)',
      }}
    >
      {/* ── LEFT PANEL (Auth Card) ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center h-full p-4 sm:p-6 lg:p-8 xl:p-12 2xl:p-16">
        <div className="no-scrollbar overflow-y-auto w-full max-w-[430px] xl:max-w-[460px] 2xl:max-w-[500px] py-2 flex flex-col items-center justify-center">
          {children}
        </div>
      </div>

      {/* ── RIGHT PANEL (Full Edge-to-Edge Cover with True Centering) ── */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-center items-stretch shrink-0 p-0">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-full h-full overflow-hidden flex flex-col justify-center items-center p-8 sm:p-12 xl:p-16 2xl:p-24 shadow-2xl"
          style={{
            background:
              'radial-gradient(ellipse at top right, #FF7A30 0%, #FF5A0A 45%, #D94000 85%, #8A2400 100%)',
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

          {/* Content Wrapper with unified vertical rhythm and equal spacing */}
          <div className="relative z-10 w-full max-w-[540px] xl:max-w-[620px] 2xl:max-w-[700px] flex flex-col gap-6 xl:gap-8 2xl:gap-10 my-auto">
            {/* Top: Header Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] xl:text-[12px] 2xl:text-[13px] font-semibold tracking-wide border border-white/25 mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>AI-POWERED MEETING INTELLIGENCE</span>
              </div>

              <h2
                className="font-bold text-white leading-[1.12] tracking-[-0.03em] mb-3 xl:mb-4"
                style={{
                  fontFamily: 'var(--font-bricolage), system-ui, sans-serif',
                  fontSize: 'clamp(28px, 2.5vw, 48px)',
                }}
              >
                Your meetings, <br />
                intelligently handled.
              </h2>

              <p className="text-[14px] xl:text-[16px] 2xl:text-[17px] text-white/90 font-normal leading-[1.6] tracking-[-0.01em]">
                MeetMatee auto-joins your calls, transcribes conversations, extracts key decisions, and syncs action items directly to your tools.
              </p>
            </div>

            {/* 4 Compact Product Cards (2x2 Grid) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="w-full grid grid-cols-2 gap-3.5 xl:gap-4.5 2xl:gap-5"
            >
              {/* Card 1: Auto-Join Bot */}
              <div className="rounded-[18px] xl:rounded-[22px] bg-white/12 backdrop-blur-xl border border-white/20 p-4 xl:p-5 2xl:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.14)] hover:bg-white/18 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3 xl:mb-4">
                  <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[9px] xl:rounded-[10px] bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-xs">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] xl:text-[11px] font-semibold text-[#34D399] bg-[#34D399]/15 px-2 py-0.5 rounded-full border border-[#34D399]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                    Auto-Join
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] xl:text-[15px] 2xl:text-[16px] font-bold text-white tracking-tight mb-0.5">
                    AI Meeting Bot
                  </h3>
                  <p className="text-[11px] xl:text-[12.5px] 2xl:text-[13px] text-white/75 leading-tight">
                    Joins Google Meet &amp; records audio hands-free
                  </p>
                </div>
              </div>

              {/* Card 2: Accurate Transcription */}
              <div className="rounded-[18px] xl:rounded-[22px] bg-white/12 backdrop-blur-xl border border-white/20 p-4 xl:p-5 2xl:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.14)] hover:bg-white/18 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3 xl:mb-4">
                  <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[9px] xl:rounded-[10px] bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-xs">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] xl:text-[11px] font-semibold text-white/90 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                    99.8% Accurate
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] xl:text-[15px] 2xl:text-[16px] font-bold text-white tracking-tight mb-0.5">
                    Live Transcripts
                  </h3>
                  <p className="text-[11px] xl:text-[12.5px] 2xl:text-[13px] text-white/75 leading-tight">
                    Speaker timestamps &amp; searchable audio RAG
                  </p>
                </div>
              </div>

              {/* Card 3: AI Summaries & Insights */}
              <div className="rounded-[18px] xl:rounded-[22px] bg-white/12 backdrop-blur-xl border border-white/20 p-4 xl:p-5 2xl:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.14)] hover:bg-white/18 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3 xl:mb-4">
                  <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[9px] xl:rounded-[10px] bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-xs">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] xl:text-[11px] font-semibold text-[#FDBA74] bg-[#FDBA74]/15 px-2 py-0.5 rounded-full border border-[#FDBA74]/30">
                    Instant AI
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] xl:text-[15px] 2xl:text-[16px] font-bold text-white tracking-tight mb-0.5">
                    Meeting Summary
                  </h3>
                  <p className="text-[11px] xl:text-[12.5px] 2xl:text-[13px] text-white/75 leading-tight">
                    Key decisions &amp; notes emailed right after call
                  </p>
                </div>
              </div>

              {/* Card 4: Action Items & Integrations */}
              <div className="rounded-[18px] xl:rounded-[22px] bg-white/12 backdrop-blur-xl border border-white/20 p-4 xl:p-5 2xl:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.14)] hover:bg-white/18 transition-all flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3 xl:mb-4">
                  <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-[9px] xl:rounded-[10px] bg-white/20 flex items-center justify-center text-white border border-white/30 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                  </div>
                  <span className="text-[10px] xl:text-[11px] font-semibold text-white/90 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
                    4 Integrations
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] xl:text-[15px] 2xl:text-[16px] font-bold text-white tracking-tight mb-0.5">
                    Action Items Sync
                  </h3>
                  <p className="text-[11px] xl:text-[12.5px] 2xl:text-[13px] text-white/75 leading-tight">
                    1-click push to Slack, Jira, Asana &amp; Trello
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
