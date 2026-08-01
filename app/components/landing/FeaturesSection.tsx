'use client'

import { Bot, Calendar, Mail, MessageSquare, Share2, Slack } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

const features = [
    {
        icon: Bot,
        title: "AI Meeting Summaries",
        description: "Automatic meeting summaries and action items after each meeting",
        color: "text-[#5B5CEB]",
        bgColor: "bg-[#5B5CEB]/10",
    },
    {
        icon: Calendar,
        title: "Smart Calendar Integration",
        description: "Connect Google Calendar and bots automatically join meetings",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        icon: Mail,
        title: "Automated Email Reports",
        description: "Receive beautiful email summaries with action items",
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        icon: MessageSquare,
        title: "Chat with Meetings",
        description: "Ask questions about meetings using our RAG pipeline",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    {
        icon: Share2,
        title: "One-Click Integrations",
        description: "Push action items to Slack, Asana, Jira and Trello",
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
    },
    {
        icon: Slack,
        title: "Slack bot Integration",
        description: "Install our Slack Bot to ask questions and share insights",
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
    },
]

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
}

const dropDownItemVariants = {
    initial: { opacity: 0, y: -90, scale: 0.92 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 240,
            damping: 20,
        },
    },
}

function FeaturesSection() {
    return (
        <section className='py-24 bg-background text-foreground relative overflow-hidden'>
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className='text-center mb-16'
                >
                    <h2 className='text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight'>
                        Everything you need for{' '}
                        <span className="bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">
                            Smarter Meetings
                        </span>
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                        From AI summaries to seamless integrations, we've got every aspect covered.
                    </p>

                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={dropDownItemVariants}
                            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                            className='bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#5B5CEB]/40 transition-all duration-200 cursor-pointer'
                        >
                            <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 shadow-xs`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className='text-xl font-bold text-foreground mb-2'>
                                {feature.title}
                            </h3>
                            <p className='text-muted-foreground leading-relaxed text-sm'>
                                {feature.description}
                            </p>

                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    )
}

export default FeaturesSection
