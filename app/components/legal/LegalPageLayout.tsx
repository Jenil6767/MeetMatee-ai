import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '../landing/Footer'
import { ArrowLeft } from 'lucide-react'

export interface LegalSection {
  title?: string
  description?: string
  paragraphs?: string[]
  items?: string[]
  footerNote?: string
  gridCards?: {
    title: string
    description: string
  }[]
  calloutBox?: {
    title?: string
    description: string
  }
  contactBox?: {
    title: string
    description: string
    email: string
  }
}

export interface LegalPageData {
  title: string
  lastUpdated: string
  intro?: string
  sections: LegalSection[]
}

interface LegalPageLayoutProps {
  data: LegalPageData
}

export default function LegalPageLayout({ data }: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#F8F6F1] text-[#111111] font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Soft warm background glow */}
      <div
        className="fixed top-0 left-0 right-0 h-[800px] pointer-events-none z-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at top, #F3E9CC 0%, #F8F6F1 50%, #F8F6F1 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        {/* Header & Main Body */}
        <div>
          {/* Navbar */}
          <header className="sticky top-4 z-50 max-w-6xl mx-auto px-3 sm:px-4 w-full">
            <nav className="bg-white/95 backdrop-blur-md border border-black/[0.08] rounded-[22px] shadow-[0_10px_35px_rgba(0,0,0,0.04)] px-4 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center gap-2">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <Image
                  src="/meetMatee.png"
                  alt="MeetMatee Logo"
                  width={160}
                  height={36}
                  priority
                  unoptimized
                  className="h-6 sm:h-8 w-auto object-contain"
                />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#FFF2EA] text-[#FF5A0A] hover:bg-[#FF5A0A] hover:text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[12px] transition-all border border-[#FF5A0A]/20 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </nav>
          </header>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto px-4 py-10 md:py-14 w-full">
            <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.06)] space-y-8">
              <div>
                <div className="inline-block text-xs font-semibold bg-[#FFF2EA] text-[#FF5A0A] px-3.5 py-1 rounded-full border border-[#FF5A0A]/20 mb-3">
                  Last Updated: {data.lastUpdated}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#111111] tracking-[-0.03em]">
                  {data.title}
                </h1>
              </div>

              {data.intro && (
                <p className="text-base text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
                  {data.intro}
                </p>
              )}

              {data.sections.map((section, idx) => (
                <React.Fragment key={idx}>
                  {/* Standard Section */}
                  {section.title && (
                    <section className="space-y-3 pt-2">
                      <h2 className="text-xl md:text-2xl font-semibold text-[#111111] tracking-[-0.02em]">
                        {section.title}
                      </h2>

                      {section.paragraphs?.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-sm md:text-base text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]"
                        >
                          {p}
                        </p>
                      ))}

                      {section.description && (
                        <p className="text-sm md:text-base text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
                          {section.description}
                        </p>
                      )}

                      {section.items && section.items.length > 0 && (
                        <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-[#5A5A5A] font-normal tracking-[-0.01em]">
                          {section.items.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      )}

                      {section.gridCards && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {section.gridCards.map((card, cIdx) => (
                            <div
                              key={cIdx}
                              className="bg-[#F8F6F1] p-5 rounded-[20px] border border-black/[0.08] space-y-2"
                            >
                              <h3 className="text-base font-semibold tracking-[-0.02em] text-[#FF5A0A]">
                                {card.title}
                              </h3>
                              <p className="text-xs text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
                                {card.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.footerNote && (
                        <p className="text-sm md:text-base text-[#5A5A5A] font-normal tracking-[-0.01em] pt-1">
                          {section.footerNote}
                        </p>
                      )}
                    </section>
                  )}

                  {/* Callout Box */}
                  {section.calloutBox && (
                    <section className="bg-[#FFF2EA] p-5 md:p-6 rounded-[20px] border border-[#FF5A0A]/20 space-y-1">
                      {section.calloutBox.title && (
                        <h3 className="text-base font-semibold tracking-[-0.02em] text-[#FF5A0A]">
                          {section.calloutBox.title}
                        </h3>
                      )}
                      <p className="text-xs md:text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
                        {section.calloutBox.description}
                      </p>
                    </section>
                  )}

                  {/* Contact Box */}
                  {section.contactBox && (
                    <section className="bg-[#F8F6F1] p-6 md:p-8 rounded-[20px] border border-black/[0.08] space-y-2">
                      <h2 className="text-xl font-semibold text-[#111111] tracking-[-0.02em]">
                        {section.contactBox.title}
                      </h2>
                      <p className="text-sm text-[#5A5A5A] font-normal tracking-[-0.01em] leading-[1.6]">
                        {section.contactBox.description}
                      </p>
                      <a
                        href={`mailto:${section.contactBox.email}`}
                        className="text-[#FF5A0A] font-semibold text-base hover:underline block"
                      >
                        {section.contactBox.email}
                      </a>
                    </section>
                  )}
                </React.Fragment>
              ))}
            </div>
          </main>
        </div>

        {/* Footer inside z-10 relative container */}
        <Footer />
      </div>
    </div>
  )
}
