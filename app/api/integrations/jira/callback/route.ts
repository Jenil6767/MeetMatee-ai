import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { userId } = await auth()

    const { searchParams } = new URL(request.url)

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!userId || !code || state !== userId) {
        return NextResponse.redirect(new URL('/integrations?error=auth_failed', process.env.NEXT_PUBLIC_APP_URL))
    }

    try {
        console.log('[Jira Callback] Exchanging code for token with client_id:', process.env.JIRA_CLIENT_ID);
        const tokenResponse = await fetch('https://auth.atlassian.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.JIRA_CLIENT_ID!,
                client_secret: process.env.JIRA_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/jira/callback`,
                code: code
            })
        })

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text()
            console.error('[Jira Callback] token exchange failed:', tokenResponse.status, errorText)
            throw new Error(`failed to exchange code for token: ${errorText}`)
        }

        const tokenData = await tokenResponse.json()
        console.log('[Jira Callback] Token exchange successful.');
        console.log('[Jira Callback] Granted scopes:', tokenData.scope);

        const resourcesResponse = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Accept': 'application/json'
            }
        })

        const resourcesText = await resourcesResponse.text()
        console.log('[Jira Callback] accessible-resources status:', resourcesResponse.status)
        console.log('[Jira Callback] accessible-resources raw body:', resourcesText)

        if (!resourcesResponse.ok) {
            console.error('[Jira Callback] accessible resources failed:', resourcesResponse.status, resourcesText)
            throw new Error(`failed to get accessible resources: ${resourcesText}`)
        }

        let resources = []
        try {
            resources = JSON.parse(resourcesText)
        } catch (e) {
            console.error('[Jira Callback] JSON parse error:', e)
        }

        console.log('[Jira Callback] Accessible resources parsed:', JSON.stringify(resources))
        let cloudId = resources[0]?.id

        // Fallback: if accessible-resources is empty, resolve cloudId from JIRA_SITE_URL env var
        if (!cloudId) {
            console.log('[Jira Callback] accessible-resources returned empty. Attempting fallback via tenant_info...')

            const jiraSiteUrl = process.env.JIRA_SITE_URL // e.g. https://meetmatee-jenil.atlassian.net
            if (jiraSiteUrl) {
                try {
                    const tenantRes = await fetch(`${jiraSiteUrl}/_edge/tenant_info`)
                    if (tenantRes.ok) {
                        const tenantData = await tenantRes.json()
                        cloudId = tenantData.cloudId
                        console.log('[Jira Callback] Fallback tenant_info cloudId:', cloudId)
                    } else {
                        console.error('[Jira Callback] tenant_info failed:', tenantRes.status)
                    }
                } catch (tenantErr) {
                    console.error('[Jira Callback] tenant_info fetch error:', tenantErr)
                }
            }

            // Validate the token actually works with the resolved cloudId
            if (cloudId) {
                try {
                    const testRes = await fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`, {
                        headers: {
                            'Authorization': `Bearer ${tokenData.access_token}`,
                            'Accept': 'application/json'
                        }
                    })
                    console.log('[Jira Callback] Direct API test status:', testRes.status)
                    if (!testRes.ok) {
                        const testText = await testRes.text()
                        console.error('[Jira Callback] Direct API test failed:', testText)
                        cloudId = null // token doesn't work with this cloudId
                    } else {
                        const meData = await testRes.json()
                        console.log('[Jira Callback] Direct API test succeeded! accountId:', meData.accountId)
                    }
                } catch (testErr) {
                    console.error('[Jira Callback] Direct API test error:', testErr)
                    cloudId = null
                }
            }
        }

        if (!cloudId) {
            console.error('[Jira Callback] Could not resolve cloudId from accessible-resources or tenant_info fallback.')
            console.error('[Jira Callback] Make sure JIRA_SITE_URL is set in .env (e.g. https://meetmatee-jenil.atlassian.net)')
            throw new Error('No accessible jira resources found in Atlassian account')
        }

        console.log('[Jira Callback] Found cloudId:', cloudId, '- saving to database...')

        await prisma.userIntegration.upsert({
            where: {
                userId_platform: {
                    userId,
                    platform: 'jira'
                }
            },
            update: {
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
                workspaceId: cloudId,
                updatedAt: new Date()
            },
            create: {
                userId,
                platform: 'jira',
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
                workspaceId: cloudId,
            }
        })

        console.log('[Jira Callback] Database upsert successful!')
        return NextResponse.redirect(new URL('/integrations?success=jira_connected&setup=jira', process.env.NEXT_PUBLIC_APP_URL))
    } catch (error: any) {
        console.error('[Jira Callback] Error:', error.message || error)
        return NextResponse.redirect(new URL('/integrations?error=save_failed', process.env.NEXT_PUBLIC_APP_URL))
    }
}