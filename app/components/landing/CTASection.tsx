'use client'

import { SignUpButton, useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ChevronsRight, Star } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  const { isSignedIn } = useUser()

  return (
    <section className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 25 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative overflow-hidden bg-white border border-black/[0.08] rounded-[28px] p-8 sm:p-14 md:p-20 text-center shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col items-center"
      >
        {/* Subtle radial glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              'radial-gradient(circle at top, #F3E9CC 0%, rgba(255,255,255,0) 65%)',
          }}
        />

        <h2 className="relative z-10 text-[30px] sm:text-[40px] md:text-[48px] font-bold text-[#0D0D0D] leading-[1.15] tracking-[-0.03em] mb-4 max-w-2xl">
          Ready to <span className="text-[#FF5A0A]">revolutionize your meetings?</span>
        </h2>

        <p className="relative z-10 text-[16px] md:text-[18px] text-[#555555] font-normal tracking-[-0.01em] leading-[1.6] max-w-lg mb-8">
          Join thousands of teams aldready using MeetingBot to save time.
        </p>

        <div className="relative z-10 mb-8">
          {isSignedIn ? (
            <Link
              href="/home"
              className="inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white font-semibold text-[16px] h-[52px] px-8 rounded-[16px] shadow-sm hover:-translate-y-[3px] transition-all duration-300 group"
            >
              <div className="w-7 h-7 rounded-[8px] bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0 group-hover:scale-105 transition-transform">
                <ChevronsRight className="w-4 h-4" />
              </div>
              <span>Dashboard</span>
            </Link>
          ) : (
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white font-semibold text-[16px] h-[52px] px-8 rounded-[16px] shadow-sm hover:-translate-y-[3px] transition-all duration-300 group cursor-pointer">
                <div className="w-7 h-7 rounded-[8px] bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <ChevronsRight className="w-4 h-4" />
                </div>
                <span>Start Your Free Trail</span>
              </button>
            </SignUpButton>
          )}
        </div>

        {/* Star Rating */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 text-sm font-medium text-[#555555]">
          <div className="flex items-center gap-1 text-[#FF5A0A]">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
          <span className="ml-1 text-[15px] font-semibold text-[#0D0D0D]">
            4.9/5 from 2+ reviews
          </span>
        </div>
      </motion.div>
    </section>
  )
}
