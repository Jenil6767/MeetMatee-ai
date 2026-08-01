'use client'

import { Button } from '@/components/ui/button'
import { SignUpButton, useUser } from '@clerk/nextjs'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function CTASection() {
    const { isSignedIn } = useUser()
    return (
        <section className='py-20 bg-background text-foreground'>
            <div className='max-w-4xl mx-auto px-4 text-center'>
                <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
                    Ready to{' '}
                    <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                        revolutionize your meetings?
                    </span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Join thousands of teams aldready using MeetingBot to save time.
                </p>
                {isSignedIn ? (
                    <Button asChild size="lg" className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4'>
                        <Link href="/home" className='group'>
                            <span>Dashboard</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                ) : (
                    <SignUpButton>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 group">
                            <span>Start Your Free Trail</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </SignUpButton>
                )}
                <div className="flex items-center justify-center space-x-1 mt-6">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className='ml-2 text-muted-foreground'>
                        4.9/5 from 2+ reviews
                    </span>
                </div>
            </div>
        </section>
    )
}

export default CTASection
