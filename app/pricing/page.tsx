'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@clerk/nextjs'
import { Check, Loader2 } from 'lucide-react'
import React, { useState } from 'react'

const plans = [
    {
        id: 'starter',
        name: 'Starter',
        price: 9,
        priceId: 'price_1RpqPqPM25qIcCJyMdRhoNah',
        description: 'Perfect for people getting started',
        features: [
            '10 meetings per month',
            '30 AI chat messages per day',
            'Meeting transcripts and summaries',
            'Action items extraction',
            'Email Notifications'
        ],
        popular: false
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 29,
        priceId: 'price_1RpqPqPM25qIcCJyWkSDTdKN',
        description: 'Perfect for people growing who need more power',
        features: [
            '30 meetings per month',
            '100 AI chat messages per day',
            'Meeting transcripts and summaries',
            'Action items extraction',
            'Email Notifications',
            'Priority Support'
        ],
        popular: true
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 99,
        priceId: 'price_1RpqPqPM25qIcCJyXD9K1yKM',
        description: 'Perfect for people who need unlimited limits',
        features: [
            'Unlimited meetings per month',
            'Unlimited AI chat messages per day',
            'Meeting transcripts and summaries',
            'Action items extraction',
            'Email Notifications',
            'Priority Support'
        ],
        popular: false
    },

]

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/design-system/animations'

function Pricing() {
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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    priceId,
                    planName
                })
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
        <div className='container mx-auto px-6 2xl:max-w-[1400px] py-16'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='max-w-2xl mx-auto text-center mb-14'
            >
                <h2 className='text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground'>
                    Choose Your <span className="bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">Plan</span>
                </h2>
                <p className="text-lg max-w-2xl mx-auto mb-8 text-muted-foreground leading-relaxed">
                    Automatic summaries, action items, and intelligent insights for every meeting.
                    Never miss important details again.
                </p>

            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch'
            >
                {plans.map((plan) => {
                    const isLoading = loading === plan.priceId

                    return (
                        <motion.div key={plan.id} variants={staggerItem} whileHover={{ y: -6 }}>
                            <Card
                                className={`relative overflow-visible flex flex-col h-full rounded-2xl border ${plan.popular
                                        ? 'border-[#5B5CEB] shadow-xl shadow-[#5B5CEB]/10 ring-1 ring-[#5B5CEB]/50'
                                        : 'border-border shadow-sm'
                                    }`}
                            >
                                {plan.popular && (
                                    <Badge className='absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] text-white px-3 py-1 shadow-md text-xs font-semibold'>
                                        Most Popular
                                    </Badge>
                                )}

                                <CardHeader className='text-center pb-2 pt-6'>
                                    <CardTitle className='mb-4 text-xl font-bold text-foreground'>{plan.name}</CardTitle>
                                    <div className='flex items-baseline justify-center gap-1'>
                                        <span className='font-extrabold text-5xl tracking-tight text-foreground'>${plan.price}</span>
                                        <span className='text-sm text-muted-foreground'>/month</span>
                                    </div>
                                </CardHeader>

                                <CardDescription className='text-center w-11/12 mx-auto text-sm text-muted-foreground mt-2'>
                                    {plan.description}
                                </CardDescription>

                                <CardContent className='flex-1 pt-6'>
                                    <ul className='space-y-3 text-sm'>
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className='flex items-center space-x-3'>
                                                <div className='w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0'>
                                                    <Check className='h-3.5 w-3.5' />
                                                </div>
                                                <span className='text-foreground/90'>{feature}</span>

                                            </li>
                                        ))}

                                    </ul>

                                </CardContent>

                                <CardFooter className='pt-6 pb-6'>
                                    <Button
                                        className={`w-full cursor-pointer rounded-xl py-3 font-semibold transition-all duration-200 ${plan.popular
                                                ? 'bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] text-white shadow-md hover:shadow-lg hover:shadow-[#5B5CEB]/25'
                                                : ''
                                            }`}
                                        variant={plan.popular ? 'default' : 'outline'}
                                        onClick={() => handleSubscribe(plan.priceId, plan.name)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                                                Processing...
                                            </>
                                        ) : (
                                            `Subscribe to ${plan.name}`
                                        )}

                                    </Button>

                                </CardFooter>

                            </Card>
                        </motion.div>
                    )
                })}

            </motion.div>
        </div>
    )
}

export default Pricing
