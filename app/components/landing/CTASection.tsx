'use client'

import { Button } from '@/components/ui/button'
import { SignUpButton, useUser } from '@clerk/nextjs'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/design-system/animations'

function CTASection() {
    const { isSignedIn } = useUser()
    return (
        <section className='py-24 bg-background text-foreground relative overflow-hidden'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,92,235,0.12)_0%,transparent_70%)] pointer-events-none' />
            <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeUp}
                className='max-w-4xl mx-auto px-4 text-center relative z-10'
            >
                <h2 className='text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight'>
                    Ready to{' '}
                    <span className="bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
                        revolutionize your meetings?
                    </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of teams aldready using MeetingBot to save time.
                </p>
                {isSignedIn ? (
                    <Button asChild size="lg" className='bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] text-white shadow-md hover:shadow-lg hover:shadow-[#5B5CEB]/25 px-8 py-4 rounded-xl'>
                        <Link href="/home" className='group'>
                            <span>Dashboard</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                ) : (
                    <SignUpButton mode="modal">
                        <Button size="lg" className="bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] text-white shadow-md hover:shadow-lg hover:shadow-[#5B5CEB]/25 px-8 py-4 group rounded-xl cursor-pointer">
                            <span>Start Your Free Trail</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </SignUpButton>
                )}
                <div className="flex items-center justify-center space-x-1 mt-8">
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <Star className="w-5 h-5 text-amber-400 fill-current" />
                    <span className='ml-2 text-muted-foreground text-sm font-medium'>
                        4.9/5 from 2+ reviews
                    </span>
                </div>
            </motion.div>
        </section>
    )
}

export default CTASection
