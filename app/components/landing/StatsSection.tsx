'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '2+', label: 'Happy Users' },
  { value: '99.69%', label: 'Uptime' },
  { value: '2min', label: 'Setup Time' },
  { value: '50hrs', label: 'Saved Per Month' },
]

export default function StatsSection() {
  return (
    <section className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            className="bg-white rounded-[24px] border border-black/[0.08] p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-center hover:-translate-y-2 transition-all duration-300"
          >
            <div className="text-[32px] sm:text-[40px] md:text-[44px] font-extrabold text-[#FF5A0A] tracking-tight leading-none mb-2">
              {stat.value}
            </div>
            <p className="text-[14px] sm:text-[15px] font-medium text-[#555555]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
