'use client'

import { motion } from 'framer-motion'
import { Bot, Check, MessageSquare, Mic2, Send, Sparkles, Zap } from 'lucide-react'

/* ─── Inline UI Mockups ────────────────────────────────────────────────────── */

function SummaryMockup() {
  return (
    <div className="mt-6 rounded-[18px] bg-[#0F0F10] p-4.5 space-y-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7.5 h-7.5 rounded-[8px] bg-[#FF5A0A] flex items-center justify-center">
            <Mic2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-white leading-none">Product Sync · Q3 Roadmap</p>
            <p className="text-[10px] text-[#888] mt-0.5">Today at 10:00 AM · 42 min</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold bg-[#18A957]/15 text-[#18A957] px-2.5 py-0.5 rounded-full border border-[#18A957]/20">
          Processed
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07]" />

      {/* Summary */}
      <div>
        <p className="text-[10px] font-bold text-[#FF7B35] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> AI Summary & Highlights
        </p>
        <p className="text-[11px] text-[#AAAAAA] leading-relaxed">
          Team aligned on Q3 feature roadmap. Launch date confirmed for Sep 15. Staging deployment starts next Monday with design signoff scheduled.
        </p>
      </div>

      {/* Action Items */}
      <div>
        <p className="text-[10px] font-bold text-[#888] uppercase tracking-wider mb-1.5">Action Items</p>
        <div className="space-y-1.5">
          {[
            'Finalize API docs & endpoints by Aug 5 — Alex',
            'Schedule final design review session — Priya',
            'Update staging environment & databases — Dev Team',
            'Draft customer release notes — Marketing',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-3.5 h-3.5 rounded-full border border-[#FF5A0A]/50 flex items-center justify-center mt-0.5 shrink-0">
                <Check className="w-2 h-2 text-[#FF5A0A]" />
              </div>
              <p className="text-[10px] text-[#BBBBBB] leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IntegrationsMockup() {
  const tools = [
    { name: 'Slack', color: '#4A154B', icon: '💬', angle: -90 },
    { name: 'Jira', color: '#0052CC', icon: '📋', angle: -30 },
    { name: 'Asana', color: '#F06A6A', icon: '✅', angle: 30 },
    { name: 'Trello', color: '#0079BF', icon: '📌', angle: 90 },
    { name: 'GCal', color: '#4285F4', icon: '📅', angle: 150 },
    { name: 'Email', color: '#EA4335', icon: '📧', angle: 210 },
  ]

  return (
    <div className="mt-6 rounded-[18px] bg-[#0F0F10] p-5 flex flex-col items-center justify-center min-h-[265px] shadow-[0_20px_50px_rgba(0,0,0,0.25)] select-none overflow-hidden">
      <div className="relative w-[220px] h-[220px]">
        {/* Orbit ring */}
        <div className="absolute inset-0 rounded-full border border-white/[0.08]" />
        <div className="absolute inset-[24px] rounded-full border border-white/[0.05]" />

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-18 h-18 rounded-[20px] bg-[#FF5A0A] flex flex-col items-center justify-center shadow-[0_0_35px_rgba(255,90,10,0.45)] z-10">
            <Bot className="w-7 h-7 text-white" />
            <p className="text-[9px] font-bold text-white mt-0.5">MeetMatee</p>
          </div>
        </div>

        {/* Tool icons orbiting */}
        {tools.map((tool, i) => {
          const rad = (tool.angle * Math.PI) / 180
          const r = 98
          const x = 110 + r * Math.cos(rad) - 16
          const y = 110 + r * Math.sin(rad) - 16
          return (
            <div
              key={i}
              className="absolute w-8 h-8 rounded-[10px] flex items-center justify-center text-[14px] shadow-md border border-white/10"
              style={{ left: x, top: y, backgroundColor: tool.color + '22', borderColor: tool.color + '44' }}
              title={tool.name}
            >
              {tool.icon}
            </div>
          )
        })}

        {/* Connector lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {tools.map((tool, i) => {
            const rad = (tool.angle * Math.PI) / 180
            const r = 98
            return (
              <line
                key={i}
                x1="110" y1="110"
                x2={110 + r * Math.cos(rad)}
                y2={110 + r * Math.sin(rad)}
                stroke="#FF5A0A" strokeWidth="1" strokeDasharray="3,3"
              />
            )
          })}
        </svg>
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        <Zap className="w-3.5 h-3.5 text-[#FF5A0A]" />
        <p className="text-[11px] font-semibold text-[#AAAAAA]">Automated 2-way sync across all connected tools</p>
      </div>
    </div>
  )
}

function ChatMockup() {
  const messages = [
    { role: 'user', text: 'What decisions were made in the product meeting?' },
    { role: 'ai', text: 'In your Q3 Product Sync, the team decided to launch on Sep 15 and push the API integration to the next sprint.' },
    { role: 'user', text: 'Who was assigned the design review?' },
    { role: 'ai', text: 'Priya was assigned the design review, scheduled for next Friday.' },
  ]

  return (
    <div className="mt-6 rounded-[18px] bg-[#0F0F10] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.25)] select-none">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-white/[0.07] flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-[#FF5A0A] flex items-center justify-center">
          <MessageSquare className="w-3 h-3 text-white" />
        </div>
        <p className="text-[11px] font-bold text-white">Chat with All Meetings</p>
        <span className="ml-auto text-[9px] bg-[#18A957]/15 text-[#18A957] px-2 py-0.5 rounded-full border border-[#18A957]/20 font-semibold">
          RAG AI
        </span>
      </div>

      {/* Messages */}
      <div className="p-3 space-y-2.5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-[12px] px-3 py-2 text-[10px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#FF5A0A] text-white rounded-br-[4px]'
                  : 'bg-white/[0.08] text-[#CCCCCC] rounded-bl-[4px]'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 bg-white/[0.06] rounded-[12px] px-3 py-2 border border-white/[0.08]">
          <p className="text-[10px] text-[#555] flex-1">Ask anything about your meetings…</p>
          <div className="w-5 h-5 rounded-[6px] bg-[#FF5A0A] flex items-center justify-center shrink-0">
            <Send className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Section ──────────────────────────────────────────────────────────── */

const cards = [
  {
    label: 'AI Intelligence & Summaries',
    title: 'Instant Automated Meeting Notes & Action Extraction',
    description:
      'Every spoken word is transcribed in real-time, summarized into key takeaways, and structured into assigned action items — delivered instantly when your call finishes. Eliminate manual note-taking entirely for your team.',
    Mockup: SummaryMockup,
    accent: '#FF5A0A',
  },
  {
    label: 'Seamless System Integrations',
    title: 'Automated 1-Click Push to Team Workspace Tools',
    description:
      'Effortlessly sync action items and channel summaries directly to Slack, Jira, Asana, and Trello. MeetMatee acts as the central hub across all your productivity tools, ensuring no task falls through the cracks.',
    Mockup: IntegrationsMockup,
    accent: '#8B5CF6',
  },
  {
    label: 'RAG-Powered AI Intelligence',
    title: 'Ask Anything Across All Past Recorded Meetings',
    description:
      'Query your entire team knowledge base using natural language AI chat. Retrieve past decisions, owner commitments, and meeting context across all sessions instantly. Turn conversational history into actionable knowledge.',
    Mockup: ChatMockup,
    accent: '#0EA5E9',
  },
]

export default function WhyChooseSection() {
  return (
    <section className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-[#FFF2EA] border border-[#FF5A0A]/20 px-3.5 py-1.5 rounded-full mb-5 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#FF5A0A]" />
          <span className="text-xs font-semibold text-[#FF5A0A] tracking-tight">Why Teams Choose MeetMatee</span>
        </div>
        <h2 className="text-[32px] sm:text-[42px] md:text-[52px] font-bold text-[#0D0D0D] leading-[1.1] tracking-[-0.03em]">
          Why Leading Teams{' '}
          <span className="text-[#FF5A0A]">Choose MeetMatee</span>
        </h2>
      </motion.div>

      {/* 3-Column Cards */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {cards.map((card, index) => {
          const { Mockup } = card
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
              className="group bg-white rounded-[24px] border border-black/[0.07] p-6 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-full"
            >
              {/* Text */}
              <div className="mb-4">
                <span
                  className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3 border"
                  style={{ color: card.accent, backgroundColor: card.accent + '15', borderColor: card.accent + '30' }}
                >
                  {card.label}
                </span>
                <h3 className="text-[19px] sm:text-[21px] font-semibold tracking-[-0.02em] text-[#0D0D0D] leading-snug mb-2 group-hover:text-[#FF5A0A] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[14px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em]">{card.description}</p>
              </div>

              {/* Mockup pinned to bottom */}
              <div className="mt-auto">
                <Mockup />
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
