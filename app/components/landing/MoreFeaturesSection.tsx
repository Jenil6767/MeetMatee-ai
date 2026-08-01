'use client'

import { Download, Settings } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/design-system/animations'

function MoreFeaturesSection() {
    return (
        <section className='py-20 bg-background text-foreground relative overflow-hidden'>
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='text-center mb-12'
                >
                    <h2 className='text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight'>
                        Plus{' '}
                        <span className="bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
                            More Features
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Everything you need for complete meeting management
                    </p>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className='grid md:grid-cols-3 gap-8'
                >
                    <motion.div
                        variants={staggerItem}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className='bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#5B5CEB]/30 transition-all duration-200'
                    >
                        <div className='w-12 h-12 bg-[#5B5CEB]/10 rounded-xl flex items-center justify-center mb-4'>
                            <Download className='w-6 h-6 text-[#5B5CEB]' />
                        </div>
                        <h3 className='text-xl font-bold text-foreground mb-2'>
                            Complete Meeting Exports
                        </h3>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            Download audio MP3, transcripts, summaries, and action items.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={staggerItem}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className='bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#5B5CEB]/30 transition-all duration-200'
                    >
                        <div className='w-12 h-12 bg-[#5B5CEB]/10 rounded-xl flex items-center justify-center mb-4'>
                            <Settings className='w-6 h-6 text-[#5B5CEB]' />
                        </div>
                        <h3 className='text-xl font-bold text-foreground mb-2'>
                            Full Customization
                        </h3>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            Customize bot name, image and toggle bot participation
                        </p>
                    </motion.div>
                    <motion.div
                        variants={staggerItem}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className='bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#5B5CEB]/30 transition-all duration-200'
                    >
                        <div className='w-12 h-12 bg-[#5B5CEB]/10 rounded-xl flex items-center justify-center mb-4'>
                            <Download className='w-6 h-6 text-[#5B5CEB]' />
                        </div>
                        <h3 className='text-xl font-bold text-foreground mb-2'>
                            Meeting Analytics
                        </h3>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            Track meeting patterns, participation rates, and productivity.
                        </p>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    )
}

export default MoreFeaturesSection
