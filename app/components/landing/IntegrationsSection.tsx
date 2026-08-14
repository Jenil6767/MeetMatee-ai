'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Check, Sparkles, Zap } from 'lucide-react'

const integrations = [
  {
    name: 'Google Calendar',
    image: 'gcal.png',
    role: 'Auto-Join Meetings',
    syncType: 'Auto-Join',
    color: '#4285F4',
  },
  {
    name: 'Slack',
    image: 'slack.png',
    role: 'Channel Summaries & AI Chat',
    syncType: 'Broadcast & RAG',
    color: '#4A154B',
  },
  {
    name: 'Asana',
    image: 'asana.png',
    role: 'Action Item Task Sync',
    syncType: '1-Click Push',
    color: '#F06A6A',
  },
  {
    name: 'Jira',
    image: 'jira.png',
    role: 'Backlog & Ticket Creation',
    syncType: '1-Click Push',
    color: '#0052CC',
  },
  {
    name: 'Trello',
    image: 'trello.png',
    role: 'Kanban Card Management',
    syncType: '1-Click Push',
    color: '#0079BF',
  },
]

export default function IntegrationsSection() {
  return (
    <section id="integrations" className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-[#FFF2EA] border border-[#FF5A0A]/20 px-3.5 py-1.5 rounded-full mb-4 shadow-xs">
          <Zap className="w-4 h-4 text-[#FF5A0A]" />
          <span className="text-xs font-semibold text-[#FF5A0A] tracking-tight">
            Seamless Workflow Hub
          </span>
        </div>

        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#0D0D0D] leading-[1.15] tracking-[-0.03em] mb-4">
          Seamless <span className="text-[#FF5A0A]">Integrations</span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em] max-w-xl mx-auto">
          Connect your calendar and favorite workspace tools. One central AI engine syncing summaries and action items instantly.
        </p>
      </motion.div>

      {/* Central Ecosystem Hub (Non-Card Diagram Layout) */}
      <div className="max-w-5xl mx-auto py-6">
        {/* Top: Central AI Hub Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center mb-10"
        >
          <div className="relative inline-flex items-center gap-3 bg-[#0F0F10] text-white px-6 py-3.5 rounded-[22px] shadow-[0_15px_40px_rgba(255,90,10,0.15)] ring-4 ring-[#FFF2EA] border border-black/10">
            <div className="w-8 h-8 rounded-[10px] bg-[#FF5A0A] flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-[#FF7B35] tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>MeetMatee AI Engine</span>
              </div>
              <p className="text-sm font-bold text-white">Automated Meeting Insights & Action Sync</p>
            </div>
          </div>
        </motion.div>

        {/* Integration Tool Flow List Rows (Non-Card Layout) */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {integrations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -25 : 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:px-6 sm:py-4.5 rounded-[20px] bg-white/70 hover:bg-white border border-black/[0.06] hover:border-[#FF5A0A]/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] group gap-3"
            >
              {/* Left: Logo & Name */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-[14px] bg-[#FFF2EA] p-2 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                  <Image
                    src={`/${item.image}`}
                    alt={`${item.name} logo`}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold tracking-[-0.02em] text-[#111111] group-hover:text-[#FF5A0A] transition-colors truncate">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#555555] font-normal tracking-[-0.01em] truncate">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Right: Sync Status Badge */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#18A957]/10 text-[#18A957] border border-[#18A957]/20 whitespace-nowrap">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{item.syncType}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Link */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            href="/integrations"
            className="inline-flex items-center gap-2 bg-[#0F0F10] hover:bg-black text-white font-semibold text-sm h-[48px] px-6 rounded-[14px] shadow-sm hover:-translate-y-[2px] transition-all cursor-pointer group"
          >
            <span>Configure App Integrations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
