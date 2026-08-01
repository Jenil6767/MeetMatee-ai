'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

function Footer() {
    return (
        <footer className='border-t border-border py-6 bg-background text-foreground'>
            <div className='max-w-6xl mx-auto px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className='flex flex-col md:flex-row justify-between items-center'
                >
                    <Link href="/" className="flex items-center gap-2 mb-4 md:mb-0 group">
                        <Image
                            src="/meetMatee.png"
                            alt="MeetMatee Logo"
                            width={200}
                            height={40}
                            priority
                            unoptimized
                            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>
                    <div className='text-muted-foreground text-sm font-medium'>
                        &copy; {new Date().getFullYear()} MeetMatee. Made with ❤️ for better meetings.
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}

export default Footer
