import { prisma } from "@/lib/db"

export async function authorizeSlack(source: { teamId?: string }) {
    try {
        const { teamId } = source

        if (!teamId) {
            throw new Error('No team ID provided')
        }
        const installation = await prisma.slackInstallation.findUnique({
            where: {
                teamId
            }
        })

        if (!installation || !installation.active) {
            console.warn('[Slack Auth] Installation not found in database for team:', teamId)
            if (process.env.SLACK_BOT_TOKEN) {
                console.log('[Slack Auth] Falling back to SLACK_BOT_TOKEN from environment for team:', teamId)
                try {
                    await prisma.slackInstallation.upsert({
                        where: { teamId },
                        update: {
                            botToken: process.env.SLACK_BOT_TOKEN,
                            active: true,
                            updatedAt: new Date()
                        },
                        create: {
                            teamId,
                            teamName: 'Workspace',
                            botToken: process.env.SLACK_BOT_TOKEN,
                            installedBy: 'bot_token_env',
                            active: true
                        }
                    })
                } catch (dbErr) {
                    console.error('[Slack Auth] Failed to auto-save fallback installation:', dbErr)
                }
                return {
                    botToken: process.env.SLACK_BOT_TOKEN,
                    teamId
                }
            }
            throw new Error(`installation not found for team: ${teamId}`)
        }

        return {
            botToken: installation.botToken,
            teamId: installation.teamId
        }
    } catch (error) {
        console.error('auth error:', error)
        throw error
    }
}