'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/design-system/animations'

function AnimatedStepDigit({ target }: { target: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, target, {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                onUpdate(value) {
                    setCount(Math.round(value))
                }
            })
            return () => controls.stop()
        }
    }, [isInView, target])

    return <span ref={ref}>{count}</span>
}

function HowItWorksSection() {
    return (
        <section className='py-24 bg-background text-foreground relative overflow-hidden'>
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='text-center mb-16'
                >
                    <h2 className='text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight'>
                        How It {' '}
                        <span className="bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
                            Works
                        </span>

                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Get Started in minutes with our simple 3-step-process
                    </p>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className='grid md:grid-cols-3 gap-12'
                >
                    <motion.div variants={staggerItem} className='text-center group'>
                        <div className='w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#5B5CEB] bg-card text-[#5B5CEB] flex items-center justify-center text-2xl font-bold group-hover:scale-110 group-hover:bg-[#5B5CEB]/10 transition-all duration-300 shadow-md'>
                            <AnimatedStepDigit target={1} />
                        </div>
                        <h3 className='text-2xl font-bold text-foreground mb-4'>Connect Calendar</h3>
                        <p className='text-muted-foreground text-base leading-relaxed'>
                            Link your Google Calendar and we'll automatically detect your meetings
                        </p>
                    </motion.div>
                    <motion.div variants={staggerItem} className='text-center group'>
                        <div className='w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#5B5CEB] bg-card text-[#5B5CEB] flex items-center justify-center text-2xl font-bold group-hover:scale-110 group-hover:bg-[#5B5CEB]/10 transition-all duration-300 shadow-md'>
                            <AnimatedStepDigit target={2} />
                        </div>
                        <h3 className='text-2xl font-bold text-foreground mb-4'>Bot Joins Meeting</h3>
                        <p className='text-muted-foreground text-base leading-relaxed'>
                            Our AI bot automatically joins and records your meetings with full transcription
                        </p>
                    </motion.div>
                    <motion.div variants={staggerItem} className='text-center group'>
                        <div className='w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#5B5CEB] bg-card text-[#5B5CEB] flex items-center justify-center text-2xl font-bold group-hover:scale-110 group-hover:bg-[#5B5CEB]/10 transition-all duration-300 shadow-md'>
                            <AnimatedStepDigit target={3} />
                        </div>
                        <h3 className='text-2xl font-bold text-foreground mb-4'>Get Insights</h3>
                        <p className='text-muted-foreground text-base leading-relaxed'>
                            Receive summaries, action items, and push them to your faviourite tools instantly
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default HowItWorksSection
