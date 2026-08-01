'use client'

import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '@/lib/design-system/animations'

const integrations = [
    { name: "Slack", image: "slack.png" },
    { name: "Asana", image: "asana.png" },
    { name: "Jira", image: "jira.png" },
    { name: "Trello", image: "trello.png" },
    { name: "Google Calendar", image: "gcal.png" }
]

function IntegrationsSection() {
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
                        Seamless{' '}
                        <span className="bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
                            Integrations
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Connect with the tools you aldready use and love
                    </p>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className='flex flex-wrap justify-center items-center gap-8 md:gap-12'
                >
                    {integrations.map((integration, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                            className='text-center group cursor-pointer'
                        >
                            <div className='w-18 h-18 mx-auto mb-4 bg-card rounded-2xl p-3.5 border border-border shadow-sm transition-all duration-300 group-hover:border-[#5B5CEB]/40 group-hover:shadow-md'>
                                <Image
                                    src={`/${integration.image}`}
                                    alt={`${integration.name} logo`}
                                    width={64}
                                    height={64}
                                    className='w-full h-full object-contain'
                                />
                            </div>
                            <p className='text-sm font-semibold text-foreground'>{integration.name}</p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}

export default IntegrationsSection
