'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    step: '01',
    title: 'Connect Calendar',
    description: "Link your Google Calendar and we'll automatically detect your meetings",
  },
  {
    step: '02',
    title: 'Bot Joins Meeting',
    description: 'Our AI bot automatically joins and records your meetings with full transcription',
  },
  {
    step: '03',
    title: 'Get Insights',
    description: 'Receive summaries, action items, and push them to your faviourite tools instantly',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-14"
      >
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#0D0D0D] leading-[1.15] tracking-[-0.03em] mb-4">
          How It <span className="text-[#FF5A0A]">Works</span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em] max-w-xl mx-auto">
          Get Started in minutes with our simple 3-step-process
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
            className="bg-white rounded-[24px] border border-black/[0.08] p-8 md:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-[8px] transition-all duration-300 flex flex-col items-start group relative"
          >
            {/* Step Badge */}
            <div className="w-12 h-12 rounded-[14px] bg-[#FFF2EA] text-[#FF5A0A] text-[18px] font-semibold flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              {item.step}
            </div>
            <h3 className="text-[20px] md:text-[21px] font-semibold tracking-[-0.02em] text-[#0D0D0D] mb-2.5">
              {item.title}
            </h3>
            <p className="text-[15px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em]">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
