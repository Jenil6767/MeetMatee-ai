'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SignOutButton, useAuth, useUser } from '@clerk/nextjs'
import { Bot, LogOut, Save, Upload, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/design-system/animations'

function Settings() {

    const { user } = useUser()
    const { userId } = useAuth()
    const [botName, setBotName] = useState('Meeting Bot')
    const [botImageUrl, setBotImageUrl] = useState(null)
    const [userPlan, setUserPlan] = useState('free')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        if (userId) {
            fetchBotSettings()
        }
    }, [userId])

    const fetchBotSettings = async () => {
        try {
            const response = await fetch('/api/user/bot-settings')
            if (response.ok) {
                const data = await response.json()
                setBotName(data.botName || 'Meeting Bot')
                setBotImageUrl(data.botImageUrl || null)
                setUserPlan(data.plan || 'free')
            }
        } catch (error) {
            console.error('error fetching bot settings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBotNameChange = (e: any) => {
        setBotName(e.target.value)
        setHasChanges(true)
    }

    const handleImageUpload = async (e: any) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await fetch('/api/upload/bot-avatar', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                setBotImageUrl(data.url)
                setHasChanges(true)
            } else {
                console.error('image uploaded failed:', data.error)
            }
        } catch (error) {
            console.error('image uploaded failed:', error)
        } finally {
            setIsUploading(false)
        }
    }

    const saveBotSettings = async () => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/user/bot-settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    botName,
                    botImageUrl
                })
            })

            if (response.ok) {
                setHasChanges(false)
            }
        } catch (error) {
            console.error('error saving bot settings:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const getPlanDisplayName = (plan: string) => {
        switch (plan.toLowerCase()) {
            case 'free':
                return 'Free Plan'
            case 'starter':
                return 'Starter Plan'
            case 'pro':
                return 'Pro Plan'
            case 'premium':
                return 'Premium Plan'
            default:
                'Invalid Plan'
        }
    }

    const getPlanColor = (plan: string) => {
        return plan.toLowerCase() === 'free'
            ? 'bg-secondary text-secondary-foreground border border-border'
            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    }

    if (isLoading) {
        return (
            <div className='min-h-screen bg-background flex items-center justify-center p-6'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#5B5CEB] mb-4'></div>
                    <div className='text-foreground font-medium'>Loading Settings...</div>
                </div>
            </div>
        )
    }


    return (
        <div className='min-h-screen bg-background p-6'>
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeUp}
                className='max-w-2xl mx-auto'
            >
                <h1 className='text-2xl font-bold text-foreground mb-8 text-center tracking-tight'>Settings</h1>
                <div className='relative bg-card rounded-2xl p-6 border border-border mb-8 shadow-sm'>
                    <div className='relative'>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className='w-16 h-16 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-[#5B5CEB]/20'>
                                {user?.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt="profile"
                                        className='w-16 h-16 rounded-full object-cover'
                                    />
                                ) : (
                                    <div className='w-16 h-16 bg-[#5B5CEB]/10 rounded-full flex items-center justify-center '>
                                        <User className='h-8 w-8 text-[#5B5CEB]' />
                                    </div>
                                )}
                            </div>
                            <h2 className='text-lg font-semibold text-foreground'>
                                {user?.fullName || 'User'}

                            </h2>
                        </div>
                        <div className='flex justify-between items-start '>
                            <div>
                                <span className='text-xs bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-semibold tracking-wider uppercase border border-border'>
                                    EMAIL
                                </span>
                                <p className='text-sm text-foreground mt-1.5 font-medium'>
                                    {user?.primaryEmailAddress?.emailAddress || 'No email'}
                                </p>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getPlanColor(userPlan)}`}>
                                {getPlanDisplayName(userPlan)}

                            </span>

                        </div>

                    </div>

                </div>

                <div className='bg-card rounded-2xl p-6 border border-border shadow-sm'>
                    <h3 className='text-lg font-semibold text-foreground mb-4'>Bot Customization</h3>

                    <div className='mb-6'>
                        <Label htmlFor='bot-name' className='block text-sm font-medium text-foreground mb-2'>
                            Bot Name
                        </Label>

                        <Input
                            id='bot-name'
                            type='text'
                            value={botName}
                            onChange={handleBotNameChange}
                            placeholder='Enter Bot Name...'
                            className='rounded-xl border-border focus:border-[#5B5CEB]'
                        />
                    </div>

                    <div className='mb-6'>
                        <Label htmlFor='bot-image-upload' className='block text-sm font-medium text-foreground mb-2'>
                            Bot Avatar
                        </Label>

                        <div className='flex items-center gap-4'>
                            <div className='w-20 h-20 bg-[#5B5CEB]/10 rounded-2xl flex items-center justify-center overflow-hidden border border-[#5B5CEB]/20'>
                                {botImageUrl ? (
                                    <img
                                        src={botImageUrl}
                                        alt='Bot Avatar'
                                        className='w-20 h-20 rounded-2xl object-cover'
                                    />
                                ) : (
                                    <Bot className='h-10 w-10 text-[#5B5CEB]' />
                                )}
                            </div>

                            <div>
                                <Input
                                    type='file'
                                    id='bot-image-upload'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className='hidden'
                                />

                                <Label
                                    htmlFor='bot-image-upload'
                                    className={`inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground border border-border rounded-xl hover:bg-muted/80 transition-colors cursor-pointer text-sm font-medium ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Upload className='h-4 w-4 text-[#5B5CEB]' />
                                    {isUploading ? 'Uploading...' : 'Upload Image'}

                                </Label>

                                <p className='text-xs text-muted-foreground mt-1.5'>
                                    JPG or PNG
                                </p>

                            </div>

                        </div>

                    </div>

                    {hasChanges && (
                        <Button
                            onClick={saveBotSettings}
                            disabled={isSaving}
                            className='inline-flex items-center gap-2 mb-6 cursor-pointer bg-[#5B5CEB] hover:bg-[#4F46E5] text-white rounded-xl shadow-sm'
                        >
                            <Save className='h-4 w-4' />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}

                    <div className='pt-4 border-t border-border'>
                        <SignOutButton>
                            <Button
                                variant='destructive'
                                className='inline-flex items-center gap-2 cursor-pointer rounded-xl'
                            >
                                <LogOut className='h-4 w-4' />
                                Sign Out
                            </Button>
                        </SignOutButton>

                    </div>

                </div>

            </motion.div>

        </div>
    )
}

export default Settings
