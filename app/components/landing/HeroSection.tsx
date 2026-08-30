'use client'

import { useState } from 'react'
import { SignUpButton, useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronsRight, Play, Sparkles, X } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const { isSignedIn } = useUser()
  const [showDemoModal, setShowDemoModal] = useState(false)

  const handleWatchDemo = () => {
    if (typeof window !== 'undefined' && (window as any).Supademo?.open) {
      ; (window as any).Supademo.open('cmtfvxago0001x10jnlgq637j')
    } else {
      setShowDemoModal(true)
    }
  }

  return (
    <section className="pt-[60px] md:pt-[80px] pb-12 md:pb-16 px-5 sm:px-8 max-w-[1280px] mx-auto overflow-hidden">
      <div className="max-w-[850px] mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 bg-[#FFF2EA] border border-[#FF5A0A]/20 px-4 py-2 rounded-full mb-8 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[#FF5A0A]" />
          <span className="text-xs sm:text-sm font-semibold text-[#FF5A0A] tracking-tight">
            AI-Powered Meeting Assistant
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-[36px] sm:text-[52px] md:text-[68px] font-bold leading-[1.12] tracking-[-0.03em] text-[#111111] mb-6 text-center max-w-[850px]"
        >
          Make your meetings
          <br />
          more effective
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-[15px] sm:text-[18px] md:text-[20px] font-normal leading-[1.6] tracking-[-0.01em] text-[#555555] max-w-[580px] text-center mb-8"
        >
          Experience crystal-clear video meetings and seamless connectivity all in one intuitive platform.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10"
        >
          {isSignedIn ? (
            <Link
              href="/home"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white font-semibold text-[15px] sm:text-[16px] h-[52px] px-6 rounded-[16px] shadow-sm hover:-translate-y-[3px] transition-all duration-300 group"
            >
              <div className="w-7 h-7 rounded-[8px] bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0 group-hover:scale-105 transition-transform">
                <ChevronsRight className="w-4 h-4" />
              </div>
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white font-semibold text-[15px] sm:text-[16px] h-[52px] px-6 rounded-[16px] shadow-sm hover:-translate-y-[3px] transition-all duration-300 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-[8px] bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0 group-hover:scale-105 transition-transform">
                <ChevronsRight className="w-4 h-4" />
              </div>
              <span>Start Free Trial</span>
            </Link>
          )}

          <button
            onClick={handleWatchDemo}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-[#fafafa] text-[#0D0D0D] font-semibold text-[15px] sm:text-[16px] h-[52px] px-6 rounded-[16px] border border-black/[0.12] shadow-xs hover:-translate-y-[3px] transition-all duration-300 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-[8px] bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0 group-hover:scale-105 transition-transform">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <span>Watch Demo</span>
          </button>
        </motion.div>


        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs sm:text-sm font-medium text-[#555555] mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A0A]" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A0A]" />
            <span>Setup in 2 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A0A]" />
            <span>Free forever plan</span>
          </div>
        </motion.div>

        {/* Hero Section Image Showcase (/hero image.png) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[1150px] mx-auto"
        >
          <img
            src="/hero image.png"
            alt="MeetMatee Platform Preview"
            className="w-full h-auto rounded-[20px] sm:rounded-[28px] md:rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/[0.06] object-contain transition-transform duration-700 hover:scale-[1.005]"
          />
        </motion.div>
      </div>

      {/* Interactive Supademo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl bg-white rounded-[24px] overflow-hidden shadow-2xl border border-black/10 flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.08] bg-[#FAF8F5]">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#FF5A0A] flex items-center justify-center text-white">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span className="font-semibold text-sm text-[#111111]">MeetMatee Interactive Demo</span>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#F0EEEA] border border-black/[0.08] flex items-center justify-center transition-colors cursor-pointer text-[#5A5A5A]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Supademo iframe container */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#0F0F10]">
                <iframe
                  src="https://app.supademo.com/embed/cmtfvxago0001x10jnlgq637j?embed_v=2"
                  frameBorder="0"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>c:\Users\ADMIN\Pictures\Screenshots\Screenshot 2026-08-27 142551.png c:\Users\ADMIN\Pictures\Screenshots\Screenshot 2026-08-27 142525.png
    </section>
  )
}
