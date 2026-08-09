'use client'

import { motion } from 'framer-motion'
import { Bot, Calendar, Mail, MessageSquare, Share2, Slack } from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Meeting Summaries',
    description: 'Automatic meeting summaries and action items after each meeting',
  },
  {
    icon: Calendar,
    title: 'Smart Calendar Integration',
    description: 'Connect Google Calendar and bots automatically join meetings',
  },
  {
    icon: Mail,
    title: 'Automated Email Reports',
    description: 'Receive beautiful email summaries with action items',
  },
  {
    icon: MessageSquare,
    title: 'Chat with Meetings',
    description: 'Ask questions about meetings using our RAG pipeline',
  },
  {
    icon: Share2,
    title: 'One-Click Integrations',
    description: 'Push action items to Slack, Asana, Jira and Trello',
  },
  {
    icon: Slack,
    title: 'Slack bot Integration',
    description: 'Install our Slack Bot to ask questions and share insights',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-14"
      >
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#0D0D0D] leading-[1.15] tracking-[-0.03em] mb-4">
          Everything you need for{' '}
          <span className="text-[#FF5A0A]">Smarter Meetings</span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em] max-w-xl mx-auto">
          From AI summaries to seamless integrations, we've got every aspect covered.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              className="bg-white rounded-[24px] border border-black/[0.08] p-8 md:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-[8px] transition-all duration-300 flex flex-col items-start group"
            >
              {/* Orange Icon Container */}
              <div className="w-12 h-12 rounded-[14px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-[20px] md:text-[21px] font-semibold tracking-[-0.02em] text-[#0D0D0D] mb-2.5">
                {feature.title}
              </h3>
              <p className="text-[15px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em]">
                {feature.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
