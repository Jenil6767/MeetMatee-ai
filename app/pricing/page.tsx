'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY!,
    description: 'Perfect for people getting started',
    features: [
      '10 meetings per month',
      '30 AI chat messages per day',
      'Meeting transcripts and summaries',
      'Action items extraction',
      'Email Notifications',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY!,
    description: 'Perfect for people growing who need more power',
    features: [
      '30 meetings per month',
      '100 AI chat messages per day',
      'Meeting transcripts and summaries',
      'Action items extraction',
      'Email Notifications',
      'Priority Support',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY!,
    description: 'Perfect for people who need unlimited limits',
    features: [
      'Unlimited meetings per month',
      'Unlimited AI chat messages per day',
      'Meeting transcripts and summaries',
      'Action items extraction',
      'Email Notifications',
      'Priority Support',
    ],
    popular: false,
  },
]

export default function Pricing() {
  const { user } = useUser()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      return
    }

    setLoading(priceId)

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('subscription creation error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing" className="py-12 md:py-16 px-4 sm:px-6 max-w-[1280px] mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-3xl mx-auto mb-8 md:mb-10"
      >
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#0D0D0D] leading-[1.15] tracking-[-0.03em] mb-4">
          Choose Your <span className="text-[#FF5A0A]">Plan</span>
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#555555] font-normal leading-[1.6] tracking-[-0.01em] max-w-xl mx-auto">
          Automatic summaries, action items, and intelligent insights for every meeting.
          Never miss important details again.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-xl mx-auto lg:max-w-none">
        {plans.map((plan, index) => {
          const isLoading = loading === plan.priceId

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              className={`relative bg-white rounded-[24px] p-7 lg:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-[8px] ${
                plan.popular
                  ? 'border-2 border-[#FF5A0A] shadow-[0_16px_50px_rgba(255,90,10,0.12)]'
                  : 'border border-black/[0.08]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF5A0A] text-white text-[11px] font-semibold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}

              <div>
                {/* Title & Price */}
                <div className="text-center mb-5">
                  <h3 className="text-[20px] md:text-[22px] font-semibold tracking-[-0.02em] text-[#0D0D0D] mb-1.5">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 my-2.5">
                    <span className="text-[40px] md:text-[46px] font-bold text-[#0D0D0D] leading-none">
                      ${plan.price}
                    </span>
                    <span className="text-[14px] text-[#555555] font-medium">/month</span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] text-[#555555] font-normal tracking-[-0.01em] min-h-[36px] leading-[1.6]">
                    {plan.description}
                  </p>
                </div>

                <hr className="border-black/[0.08] my-5" />

                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2.5 text-[14px] text-[#555555] font-normal tracking-[-0.01em]">
                      <div className="w-4 h-4 rounded-full bg-[#FFF2EA] text-[#FF5A0A] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSubscribe(plan.priceId, plan.id)}
                disabled={isLoading}
                className={`w-full h-[52px] rounded-[16px] font-semibold text-[16px] transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  plan.popular
                    ? 'bg-[#0F0F10] hover:bg-black text-white shadow-sm hover:-translate-y-[2px]'
                    : 'bg-white border border-black/[0.12] text-[#0D0D0D] hover:bg-[#fafafa] hover:-translate-y-[2px]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#FF5A0A]" />
                    Processing...
                  </>
                ) : (
                  `Subscribe to ${plan.name}`
                )}
              </button>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
