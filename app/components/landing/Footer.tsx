'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-black/[0.08] relative z-20 py-8 md:py-10 shadow-xs">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-6 border-b border-black/[0.08]">
          {/* Left Column: Logo & Subtext - full width on mobile */}
          <div className="col-span-2 md:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <Image
                src="/meetMatee.png"
                alt="MeetMatee Logo"
                width={160}
                height={32}
                priority
                unoptimized
                className="h-[30px] w-auto object-contain opacity-100"
              />
            </Link>
            <p className="text-xs sm:text-sm text-[#444444] font-normal tracking-[-0.01em] leading-[1.6] max-w-sm">
              An AI-powered meeting assistant for modern teams. Automatic summaries, action items, and intelligent insights for every meeting.
            </p>
          </div>

          {/* Center Column: Product */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-[-0.02em] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <a href="/#features" className="text-[#333333] hover:text-[#FF5A0A] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/#integrations" className="text-[#333333] hover:text-[#FF5A0A] transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-[#333333] hover:text-[#FF5A0A] transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <a href="/pricing" className="text-[#333333] hover:text-[#FF5A0A] transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column: Legal */}
          <div>
            <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-[-0.02em] mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-medium">
              <li>
                <Link href="/privacy-policy" className="text-[#333333] hover:text-[#FF5A0A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#333333] hover:text-[#FF5A0A] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="text-[#333333] hover:text-[#FF5A0A] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Copyright */}
        <div className="pt-5 text-center text-xs text-[#555555] font-normal tracking-[-0.01em]">
          &copy; 2026 MeetMatee. Transform conversations into actionable insights.
        </div>
      </div>
    </footer>
  )
}
