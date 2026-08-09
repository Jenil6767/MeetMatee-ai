'use client'

import { motion } from 'framer-motion'
import {
  Bot,
  ExternalLink,
  HeadphonesIcon,
  Mail,
  MessageSquareText,
  ScrollText,
  Sparkles,
} from 'lucide-react'

const moreFeatures = [
  {
    icon: HeadphonesIcon,
    title: 'Built-in Audio Playback',
    description:
      'Replay any recorded meeting directly in the app with our custom audio player — seek, pause, and review sessions anytime.',
    tag: 'Meeting Details',
  },
  {
    icon: ScrollText,
    title: 'Full Meeting Transcripts',
    description:
      'Every spoken word is transcribed and stored. Browse timestamped transcripts alongside your summaries and action items.',
    tag: 'AI Transcription',
  },
  {
    icon: MessageSquareText,
    title: 'Chat with Your Meetings',
    description:
      'Ask questions like "What were the key decisions?" and get intelligent answers powered by our RAG AI pipeline — across all past meetings.',
    tag: 'RAG-Powered',
  },
  {
    icon: Bot,
    title: 'Custom AI Bot Identity',
    description:
      'Set a custom name and upload a unique avatar for your AI meeting bot. Your brand, your bot.',
    tag: 'Bot Settings',
  },
  {
    icon: Mail,
    title: 'Automated Email Reports',
    description:
      'Receive beautifully formatted email reports after every meeting with summaries, transcripts, and action items.',
    tag: 'Email Notifications',
  },
  {
    icon: ExternalLink,
    title: '1-Click Action Item Push',
    description:
      'Send any AI-extracted action item directly to Jira, Asana, Trello, or Slack with one click — right from inside the meeting details page.',
    tag: 'Integrations',
  },
]


export default function MoreFeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-[#FFF2EA] border border-[#FF5A0A]/20 px-3.5 py-1.5 rounded-full mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#FF5A0A]" />
          <span className="text-xs font-semibold text-[#FF5A0A] tracking-tight">
            Built into every plan
          </span>
        </div>

        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#0D0D0D] leading-[1.15] tracking-[-0.03em] mb-4">
          Plus <span className="text-[#FF5A0A]">More Features</span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em] max-w-xl mx-auto">
          Every tool you need for end-to-end meeting management, built and shipped into the product.
        </p>
      </motion.div>

      {/* 3-col Feature Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {moreFeatures.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
              className="bg-white rounded-[24px] border border-black/[0.07] p-6 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.05)] hover:-translate-y-[6px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-[#FF5A0A]/20 transition-all duration-300 flex flex-col gap-4 group"
            >
              {/* Icon + Tag row */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-[13px] bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-[#808080] bg-[#F4EFE5] px-2.5 py-1 rounded-full border border-black/[0.06] whitespace-nowrap">
                  {feature.tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3 className="text-[17px] sm:text-[18px] font-semibold tracking-[-0.02em] text-[#0D0D0D] mb-1.5 group-hover:text-[#FF5A0A] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
