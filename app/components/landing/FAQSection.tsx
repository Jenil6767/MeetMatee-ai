'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'How does MeetMatee automatically join my meetings?',
    answer:
      'Once you connect your Google Calendar, MeetMatee detects all your upcoming meetings automatically. Before each scheduled meeting, our AI bot is dispatched to join the call, record audio, and generate a full transcript  without any manual action needed from you.',
  },
  {
    question: 'What does the AI do after each meeting?',
    answer:
      'After every meeting, MeetMatee\'s AI pipeline processes the full recording and transcript to generate: a concise meeting summary, a list of extracted action items, and a searchable RAG-indexed archive. You also receive a beautifully formatted email report containing all of this.',
  },
  {
    question: 'Can I chat with my past meetings?',
    answer:
      'Yes! Our AI Chat feature (powered by a RAG pipeline) lets you ask natural language questions like "What decisions were made last Tuesday?" or "Who was assigned the design task?" across all your past processed meetings. Head to the Chat section in your dashboard to try it.',
  },
  {
    question: 'How do I push action items to Slack, Jira, Asana, or Trello?',
    answer:
      'Once you connect an integration from the Integrations page, you\'ll see an "Add to [Platform]" button directly inside each meeting\'s details page. Click it to instantly push extracted action items to your connected Slack channel, Jira backlog, Asana project, or Trello board with one click.',
  },
  {
    question: 'Can I customize the AI bot that joins my meetings?',
    answer:
      'Absolutely. From your Settings page, you can set a custom display name and upload a custom avatar image for your AI bot. You can also toggle the bot on or off for any specific upcoming meeting directly from your Dashboard.',
  },
  {
    question: 'What subscription plans are available and what are the limits?',
    answer:
      'MeetMatee offers three plans:\n\n• Starter ($9/mo): 10 meetings/month, 30 AI chat messages/day\n• Pro ($29/mo): 30 meetings/month, 100 AI chat messages/day, Priority Support\n• Premium ($99/mo): Unlimited meetings, Unlimited AI chat, Priority Support\n\nAll plans include meeting transcripts, summaries, action items, and email notifications.',
  },
  {
    question: 'Is my meeting data secure and private?',
    answer:
      'Yes. Meeting recordings are stored securely in AWS S3 with private, signed URLs. Transcripts and summaries are stored in your own dedicated database record and are never shared across accounts. Authentication is handled by Clerk with enterprise-grade security.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-12 md:py-16 px-5 sm:px-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-[#FFF2EA] border border-[#FF5A0A]/20 px-3.5 py-1.5 rounded-full mb-4 shadow-xs">
          <HelpCircle className="w-4 h-4 text-[#FF5A0A]" />
          <span className="text-xs font-semibold text-[#FF5A0A] tracking-tight">
            Common Questions
          </span>
        </div>
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#0D0D0D] leading-[1.15] tracking-[-0.03em] mb-4">
          Frequently Asked <span className="text-[#FF5A0A]">Questions</span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em] max-w-xl mx-auto">
          Everything you need to know about MeetMatee's features, plans, and how it all works.
        </p>
      </motion.div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
              className={`rounded-[20px] border transition-all duration-300 overflow-hidden ${isOpen
                  ? 'border-[#FF5A0A]/30 bg-white shadow-[0_10px_35px_rgba(255,90,10,0.08)]'
                  : 'border-black/[0.08] bg-white/80 hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]'
                }`}
            >
              {/* Question Row */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span
                  className={`text-[15px] sm:text-[16px] font-semibold tracking-[-0.02em] leading-snug transition-colors ${isOpen ? 'text-[#FF5A0A]' : 'text-[#111111] group-hover:text-[#FF5A0A]'
                    }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 ${isOpen
                      ? 'bg-[#FF5A0A] text-white rotate-180'
                      : 'bg-[#F4EFE5] text-[#555555]'
                    }`}
                >
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>

              {/* Answer Collapse/Expand */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="h-px bg-[#FF5A0A]/10 mb-4" />
                      <p className="text-[14px] sm:text-[15px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em] whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
