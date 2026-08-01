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
                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
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
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                            Get Started
                                        </Button>
                                    </SignUpButton>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <section className="py-20 px-4 bg-background text-foreground">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="group relative mx-auto flex w-fit items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#3b82f61f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#3b82f63f] mb-8">
                        <span
                            className={cn(
                                "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#3b82f6]/50 via-[#1d4ed8]/50 to-[#3b82f6]/50 bg-[length:300%_100%] p-[1px]",
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
                        <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                        <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
                        <AnimatedGradientText className="text-sm font-medium text-foreground/80">
                            AI-Powered Meeting Assistant
                        </AnimatedGradientText>
                        <ChevronRight
                            className="ml-1 w-4 h-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
                        />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Transform Your Meetings with{' '}
                        <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">AI Magic</span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto mb-8 text-muted-foreground">
                        Automatic summaries, action items, and intelligent insights for every meeting.
                        Never miss important details again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        {isSignedIn ? (
                            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4" >
                                <Link href="/home" className="group">
                                    <span>Dashboard</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />

                                </Link>
                            </Button>
                        ) : (
                            <SignUpButton mode="modal">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 group cursor-pointer">
                                    <span>Start Free Trial</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </SignUpButton>
                        )}

                        <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-muted px-8 py-4 cursor-pointer">
                            <Play className="w-5 h-5 mr-2" />
                            <span>Watch Demo</span>
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Setup in 2 minutes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Free forever plan</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}