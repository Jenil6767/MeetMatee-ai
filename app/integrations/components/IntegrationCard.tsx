import React from 'react'
import { Integration } from '../hooks/useIntegrations'
import Image from 'next/image'
import { Check, ExternalLink, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface IntegrationCardProps {
    integration: Integration
    onConnect: (platform: string) => void
    onDisconnect: (platform: string) => void
    onSetup: (platform: string) => void
}


function IntegrationCard({
    integration,
    onConnect,
    onDisconnect,
    onSetup
}: IntegrationCardProps) {
    return (
        <div className='bg-card rounded-2xl p-6 border border-border shadow-sm hover:border-[#5B5CEB]/30 hover:shadow-md transition-all duration-200'>
            <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 relative flex-shrink-0'>
                        <Image
                            src={integration.logo}
                            alt={`${integration.name} logo`}
                            fill
                            className='object-contain rounded-xl'
                        />

                    </div>
                    <div>
                        <h3 className='font-semibold text-foreground'>{integration.name}</h3>

                        {integration.connected && (
                            <span className='text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium'>
                                Connected
                            </span>
                        )}
                    </div>

                </div>
                {integration.connected && (
                    <Check className='h-5 w-5 text-emerald-500' />
                )}
            </div>
            <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>
                {integration.description}
            </p>

            {integration.connected && integration.platform !== 'google-calendar' && (integration.boardName || integration.projectName || integration.channelName) && (
                <div className='mb-4 p-3 bg-muted/60 rounded-xl border border-border'>
                    <div className='text-xs text-muted-foreground mb-1'>Destination:</div>
                    <div className='text-sm font-semibold text-foreground' >
                        {integration.platform === 'slack' && integration.channelName && `#${integration.channelName}`}
                        {integration.platform === 'trello' && integration.boardName}
                        {integration.platform === 'jira' && integration.projectName}
                        {integration.platform === 'asana' && integration.projectName}
                    </div>
                </div>
            )}

            {integration.connected && integration.platform === 'google-calendar' && (
                <div className='mb-4 p-3 bg-muted/60 rounded-xl border border-border'>
                    <div className='text-xs text-muted-foreground mb-1'>Status:</div>
                    <div className='text-sm font-semibold text-foreground'>
                        Lambda auto-sync anabled
                    </div>
                </div>
            )}

            <div className='flex gap-2'>
                {integration.connected ? (
                    integration.platform === 'google-calendar' ? (
                        <Button
                            variant="outline"
                            onClick={() => onDisconnect(integration.platform)}
                            className='flex-1 cursor-pointer rounded-xl border-border hover:bg-muted'
                            type='button'
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onDisconnect(integration.platform)}
                                className='flex-1 cursor-pointer rounded-xl border-border hover:bg-muted'
                                type='button'
                            >
                                Disconnect
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => onSetup(integration.platform)}
                                className='px-3 py-2 cursor-pointer rounded-xl border-border hover:bg-muted'
                                type='button'
                            >
                                <Settings className='h-4 w-4 text-[#5B5CEB]' />
                            </Button>
                        </>
                    )
                ) : (
                    <Button
                        onClick={() => onConnect(integration.platform)}
                        className='flex-1 flex items-center justify-center gap-2 cursor-pointer bg-[#5B5CEB] hover:bg-[#4F46E5] text-white rounded-xl shadow-xs'
                        type='button'
                    >
                        Connect
                        <ExternalLink className='h-4 w-4' />
                    </Button>
                )}

            </div>

        </div>
    )
}

export default IntegrationCard
