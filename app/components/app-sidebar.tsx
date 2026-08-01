import { Bot, DollarSign, Home, Layers3, Moon, Settings, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUsage } from "../contexts/UsageContext";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const items = [
    {
        title: "Home",
        url: "/home",
        icon: Home,
    },
    {
        title: "Integrations",
        url: "/integrations",
        icon: Layers3,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
    {
        title: "Chat with AI",
        url: "/chat",
        icon: Bot,
    },
    {
        title: "Pricing",
        url: "/pricing",
        icon: DollarSign,
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const { usage, limits } = useUsage()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const meetingProgress = usage && limits.meetings !== -1
        ? Math.min((usage.meetingsThisMonth / limits.meetings) * 100, 100)
        : 0

    const chatProgress = usage && limits.chatMessages !== -1
        ? Math.min((usage.chatMessagesToday / limits.chatMessages) * 100, 100)
        : 0


    const getUpgradeInfo = () => {
        if (!usage) return null

        switch (usage.currentPlan) {
            case 'free':
                return {
                    title: "Upgrade to Starter",
                    description: "Get 10 meetings per month and 30 daily chat messages",
                    showButton: true
                }
            case 'starter':
                return {
                    title: "Upgrade to Pro",
                    description: "Get 30 meetings per month and 100 daily chat messages",
                    showButton: true
                }

            case 'pro':
                return {
                    title: "Upgrade to Premium",
                    description: "Get unlimited meetings and chat messages",
                    showButton: true
                }
            case 'premium':
                return {
                    title: "You're on Premium broski!",
                    description: "Enjoying unlimited access to all features",
                    showButton: false
                }

            default:
                return {
                    title: "Upgrade Your Plan",
                    description: "Get access to more features",
                    showButton: true
                }
        }
    }

    const upgradeInfo = getUpgradeInfo()

    return (
        <Sidebar collapsible="none" className="border-r border-sidebar-border h-screen">
            <SidebarHeader className="border-b border-sidebar-border p-4 flex flex-row items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/meet_matee.png"
                        alt="MeetMatee Logo"
                        width={160}
                        height={40}
                        priority
                        unoptimized
                        className="h-9 w-auto object-contain"
                    />
                </Link>
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="h-8 w-8 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer transition-colors"
                        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4 h-4 text-yellow-500" />
                        ) : (
                            <Moon className="w-4 h-4 text-blue-500" />
                        )}
                    </Button>
                )}
            </SidebarHeader>

            <SidebarContent className="flex-1 p-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        className="w-full justify-start gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#5B5CEB] data-[active=true]:to-[#4F46E5] data-[active=true]:text-white data-[active=true]:shadow-md"
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto">
                {usage && (
                    <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4 mb-3 shadow-sm">
                        <p className="text-xs font-semibold tracking-wider text-sidebar-foreground uppercase mb-3">
                            Current Plan: <span className="text-[#5B5CEB] font-bold">{usage.currentPlan.toUpperCase()}</span>
                        </p>

                        <div className="space-y-2 mb-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-sidebar-foreground/70">
                                    Meetings
                                </span>
                                <span className="font-semibold text-sidebar-foreground">
                                    {usage.meetingsThisMonth}/{limits.meetings === -1 ? '∞' : limits.meetings}
                                </span>
                            </div>
                            {limits.meetings !== -1 && (
                                <div className="w-full bg-sidebar-accent/60 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-[#5B5CEB] h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${meetingProgress}%` }}
                                    > </div>
                                </div>
                            )}
                            {limits.meetings === -1 && (
                                <div className="text-xs text-sidebar-foreground/50 italic">Unlimited</div>
                            )}
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-sidebar-foreground/70">
                                    Chat Messages
                                </span>
                                <span className="font-semibold text-sidebar-foreground">
                                    {usage.chatMessagesToday}/{limits.chatMessages === -1 ? '∞' : limits.chatMessages}
                                </span>
                            </div>
                            {limits.chatMessages !== -1 && (
                                <div className="w-full bg-sidebar-accent/60 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-[#5B5CEB] h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${chatProgress}%` }}
                                    > </div>
                                </div>
                            )}
                            {limits.chatMessages === -1 && (
                                <div className="text-xs text-sidebar-foreground/50 italic">Unlimited</div>
                            )}
                        </div>

                    </div>
                )}

                {upgradeInfo && (
                    <div className="rounded-2xl border border-sidebar-border bg-card p-4 shadow-sm">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                    {upgradeInfo.title}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {upgradeInfo.description}
                                </p>
                            </div>
                            {upgradeInfo.showButton && (
                                <Link href="/pricing">
                                    <Button className="w-full rounded-xl bg-gradient-to-r from-[#5B5CEB] to-[#4F46E5] px-3 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer">
                                        {upgradeInfo.title}
                                    </Button>
                                </Link>
                            )}

                            {!upgradeInfo.showButton && (
                                <div className="text-center py-2">
                                    <span className="text-xs text-sidebar-accent-foreground/60">🎉 Thank you for your support!</span>
                                </div>
                            )}

                        </div>
                    </div>
                )}

            </SidebarFooter>

        </Sidebar>
    )
}