'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/design-system/animations'

function AnimatedStatDigit({ target, suffix = '', decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, target, {
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
                onUpdate(value) {
                    setCount(Number(value.toFixed(decimals)))
                }
            })
            return () => controls.stop()
        }
    }, [isInView, target, decimals])

    return (
        <span ref={ref}>
            {decimals > 0 ? count.toFixed(decimals) : count}{suffix}
        </span>
    )
}

function StatsSection() {
    return (

        <section className='py-20 bg-background text-foreground relative overflow-hidden'>
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className='grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border'
                >
                    <motion.div variants={staggerItem} className='text-center group'>
                        <div className='text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2'>
                            <AnimatedStatDigit target={2} suffix="+" />
                        </div>
                        <p className='text-muted-foreground font-medium text-sm'>Happy Users</p>
                    </motion.div>
                    <motion.div variants={staggerItem} className='text-center group'>
                        <div className='text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2'>
                            <AnimatedStatDigit target={99.69} suffix="%" decimals={2} />
                        </div>
                        <p className='text-muted-foreground font-medium text-sm'>Uptime</p>
                    </motion.div>
                    <motion.div variants={staggerItem} className='text-center group'>
                        <div className='text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2'>
                            <AnimatedStatDigit target={2} suffix="min" />
                        </div>
                        <p className='text-muted-foreground font-medium text-sm'>Setup Time</p>
                    </motion.div>
                    <motion.div variants={staggerItem} className='text-center group'>
                        <div className='text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent mb-2'>
                            <AnimatedStatDigit target={50} suffix="hrs" />
                        </div>
                        <p className='text-muted-foreground font-medium text-sm'>Saved Per Month</p>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    )
}

export default StatsSection
