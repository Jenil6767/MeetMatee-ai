'use client'

import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { ArrowRight, CheckCircle, ChevronRight, Moon, Play, Sparkles, Sun } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/design-system/animations"

export default function HeroSection() {
    const { isSignedIn } = useUser()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/meetMatee.png"
                                alt="MeetMatee Logo"
                                width={200}
                                height={40}
                                priority
                                unoptimized
                                className="h-9 w-auto object-contain"
                            />
                        </Link>
                        <div className="flex items-center gap-3">
                            {mounted && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="border-border text-foreground hover:bg-muted cursor-pointer transition-colors"
                                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="w-4 h-4 text-yellow-500" />
                                    ) : (
                                        <Moon className="w-4 h-4 text-blue-500" />
                                    )}
                                </Button>
                            )}

                            {isSignedIn ? (
                                <Button asChild className="bg-[#5B5CEB] hover:bg-[#4F46E5] text-white shadow-md">
                                    <Link href="/home">Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <SignInButton mode="modal">
                                        <Button variant="outline" className="border-border text-foreground hover:bg-muted cursor-pointer">
                                            Sign In
                                        </Button>
                                    </SignInButton>

                                    <SignUpButton mode="modal">
                                        <Button className="bg-[#5B5CEB] hover:bg-[#4F46E5] text-white shadow-md cursor-pointer">
                                            Get Started
                                        </Button>
                                    </SignUpButton>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <section className="py-20 px-4 bg-background text-foreground relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(91,92,235,0.15),rgba(255,255,255,0))]" />
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <motion.div variants={staggerItem} className="group relative mx-auto flex w-fit items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#5b5ceb1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#5b5ceb3f] mb-8">
                        <span
                            className={cn(
                                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#5B5CEB]/50 via-[#4F46E5]/50 to-[#5B5CEB]/50 bg-[length:300%_100%] p-[1px]",
                            )}
                            style={{
                                WebkitMask:
                                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                WebkitMaskComposite: "destination-out",
                                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                maskComposite: "subtract",
                                WebkitClipPath: "padding-box",
                            }}
                        />
                        <Sparkles className="w-4 h-4 mr-2 text-[#5B5CEB]" />
                        <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                        <AnimatedGradientText className="text-sm font-medium text-foreground/80">
                            AI-Powered Meeting Assistant
                        </AnimatedGradientText>
                        <ChevronRight
                            className="ml-1 w-4 h-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
                        />
                    </motion.div>
                    <motion.h1 variants={staggerItem} className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                        Transform Your Meetings with{' '}
                        <span className="bg-gradient-to-r from-[#5B5CEB] via-[#6366F1] to-[#3B82F6] bg-clip-text text-transparent">AI Magic</span>
                    </motion.h1>
                    <motion.p variants={staggerItem} className="text-lg max-w-2xl mx-auto mb-8 text-muted-foreground leading-relaxed">
                        Automatic summaries, action items, and intelligent insights for every meeting.
                        Never miss important details again.
                    </motion.p>
                    <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        {isSignedIn ? (
                            <Button asChild size="lg" className="bg-[#5B5CEB] hover:bg-[#4F46E5] text-white shadow-md hover:shadow-lg hover:shadow-[#5B5CEB]/25 px-8 py-4" >
                                <Link href="/home" className="group">
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />

                                </Link>
                            </Button>
                        ) : (
                            <SignUpButton mode="modal">
                                <Button size="lg" className="bg-[#5B5CEB] hover:bg-[#4F46E5] text-white shadow-md hover:shadow-lg hover:shadow-[#5B5CEB]/25 px-8 py-4 group cursor-pointer">
                                    <span>Start Free Trial</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </SignUpButton>
                        )}

                        <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-muted px-8 py-4 cursor-pointer">
                            <Play className="w-5 h-5 mr-2" />
                            <span>Watch Demo</span>
                        </Button>
                    </motion.div>
                    <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Setup in 2 minutes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Free forever plan</span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </>
    )
}