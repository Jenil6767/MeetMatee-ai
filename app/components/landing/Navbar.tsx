'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronsRight, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { isSignedIn } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="pointer-events-auto w-full max-w-max bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-[22px] shadow-[0_10px_35px_rgba(0,0,0,0.06)] px-[18px] py-[10px] h-[70px] flex items-center justify-between gap-8 md:gap-12"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/meetMatee.png"
            alt="MeetMatee Logo"
            width={180}
            height={36}
            priority
            unoptimized
            className="h-[34px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-[38px]">
          <a
            href="#features"
            className="text-[16px] font-medium text-[#222222] hover:text-[#FF5A0A] transition-colors duration-200"
          >
            Features
          </a>
          <a
            href="#integrations"
            className="text-[16px] font-medium text-[#222222] hover:text-[#FF5A0A] transition-colors duration-200"
          >
            Integrations
          </a>
          <a
            href="#pricing"
            className="text-[16px] font-medium text-[#222222] hover:text-[#FF5A0A] transition-colors duration-200"
          >
            Pricing
          </a>
        </div>

        {/* Right Action / CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isSignedIn ? (
            <Link
              href="/home"
              className="inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white text-[15px] font-semibold h-[48px] px-4 rounded-[14px] transition-all duration-300 hover:-translate-y-[2px] shadow-sm group"
            >
              <div className="w-6 h-6 rounded-md bg-[#FF5A0A] flex items-center justify-center mr-2 text-white shrink-0">
                <ChevronsRight className="w-3.5 h-3.5" />
              </div>
              <span>Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="text-[15px] font-medium text-[#222222] hover:text-[#FF5A0A] px-3 py-2 transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="inline-flex items-center justify-center bg-[#0F0F10] hover:bg-black text-white text-[15px] font-semibold h-[48px] px-4 rounded-[14px] transition-all duration-300 hover:-translate-y-[2px] shadow-sm group cursor-pointer">
                  <div className="w-6 h-6 rounded-md bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0 group-hover:scale-105 transition-transform">
                    <ChevronsRight className="w-3.5 h-3.5" />
                  </div>
                  <span>Get Started</span>
                </button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2 text-[#0D0D0D] hover:text-[#FF5A0A] transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-[82px] left-4 right-4 bg-white border border-black/[0.08] rounded-[22px] shadow-[0_10px_35px_rgba(0,0,0,0.1)] p-6 flex flex-col gap-4 text-center md:hidden z-50"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[17px] font-medium text-[#222222] py-2 hover:text-[#FF5A0A]"
            >
              Features
            </a>
            <a
              href="#integrations"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[17px] font-medium text-[#222222] py-2 hover:text-[#FF5A0A]"
            >
              Integrations
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[17px] font-medium text-[#222222] py-2 hover:text-[#FF5A0A]"
            >
              Pricing
            </a>
            <hr className="border-black/[0.08] my-1" />
            {isSignedIn ? (
              <Link
                href="/home"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center bg-[#0F0F10] text-white text-[16px] font-semibold h-[52px] px-6 rounded-[16px]"
              >
                <div className="w-7 h-7 rounded-md bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0">
                  <ChevronsRight className="w-4 h-4" />
                </div>
                <span>Dashboard</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <SignInButton mode="modal">
                  <button className="w-full text-[16px] font-medium text-[#222222] py-3 hover:text-[#FF5A0A]">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full inline-flex items-center justify-center bg-[#0F0F10] text-white text-[16px] font-semibold h-[52px] px-6 rounded-[16px]">
                    <div className="w-7 h-7 rounded-md bg-[#FF5A0A] flex items-center justify-center mr-2.5 text-white shrink-0">
                      <ChevronsRight className="w-4 h-4" />
                    </div>
                    <span>Get Started</span>
                  </button>
                </SignUpButton>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
