import Image from 'next/image'
import React from 'react'

const integrations = [
    { name: "Slack", image: "slack.png" },
    { name: "Asana", image: "asana.png" },
    { name: "Jira", image: "jira.png" },
    { name: "Trello", image: "trello.png" },
    { name: "Google Calendar", image: "gcal.png" }
]

function IntegrationsSection() {
    return (
        <section className='py-20 bg-background text-foreground'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='text-center mb-16'>
                    <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
                        Seamless{' '}
                        <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
                            Integrations
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Connect with the tools you aldready use and love
                    </p>
                </div>
                <div className='flex flex-wrap justify-center items-center gap-8 md:gap-12'>
                    {integrations.map((integration, index) => (
                        <div
                            key={index}
                            className='text-center group cursor-pointer'
                        >
                            <div className='w-16 h-16 mx-auto mb-4 bg-card rounded-xl p-3 border border-border transition-all duration-300 group-hover:scale-110 group-hover:bg-accent'>
                                <Image
                                    src={`/${integration.image}`}
                                    alt={`${integration.name} logo`}
                                    width={64}
                                    height={64}
                                    className='w-full h-full object-contain'
                                />
                            </div>
                            <p className='text-sm font-medium text-foreground'>{integration.name}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default IntegrationsSection
