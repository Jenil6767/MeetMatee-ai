import { Download, Settings } from 'lucide-react'
import React from 'react'

function MoreFeaturesSection() {
    return (
        <section className='py-10 bg-background text-foreground'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
                        Plus{' '}
                        <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                            More Features
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need for complete meeting management
                    </p>
                </div>
                <div className='grid md:grid-cols-3 gap-8'>
                    <div className='bg-card text-card-foreground border border-border rounded-xl p-6 hover:bg-accent/50 transition-all'>
                        <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4'>
                            <Download className='w-6 h-6 text-blue-500' />
                        </div>
                        <h3 className='text-xl font-semibold text-foreground mb-2'>
                            Complete Meeting Exports
                        </h3>
                        <p className='text-muted-foreground'>
                            Download audio MP3, transcripts, summaries, and action items.
                        </p>
                    </div>
                    <div className='bg-card text-card-foreground border border-border rounded-xl p-6 hover:bg-accent/50 transition-all'>
                        <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4'>
                            <Settings className='w-6 h-6 text-blue-500' />
                        </div>
                        <h3 className='text-xl font-semibold text-foreground mb-2'>
                            Full Customization
                        </h3>
                        <p className='text-muted-foreground'>
                            Customize bot name, image and toggle bot participation
                        </p>
                    </div>
                    <div className='bg-card text-card-foreground border border-border rounded-xl p-6 hover:bg-accent/50 transition-all'>
                        <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4'>
                            <Download className='w-6 h-6 text-blue-500' />
                        </div>
                        <h3 className='text-xl font-semibold text-foreground mb-2'>
                            Meeting Analytics
                        </h3>
                        <p className='text-muted-foreground'>
                            Track meeting patterns, participation rates, and productivity.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default MoreFeaturesSection
