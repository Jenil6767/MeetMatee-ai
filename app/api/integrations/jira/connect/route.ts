import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { email, apiToken, siteUrl } = await request.json()

    if (!email || !apiToken || !siteUrl) {
        return NextResponse.json({ error: 'email, apiToken, and siteUrl are required' }, { status: 400 })
    }

    // Normalize site URL
    const normalizedSiteUrl = siteUrl.replace(/\/$/, '').toLowerCase()
    const fullSiteUrl = normalizedSiteUrl.startsWith('https://') ? normalizedSiteUrl : `https://${normalizedSiteUrl}`

    try {
        // Step 1: Get the cloudId from tenant_info
        console.log('[Jira Connect] Fetching tenant info from:', fullSiteUrl)
        const tenantRes = await fetch(`${fullSiteUrl}/_edge/tenant_info`)
        if (!tenantRes.ok) {
            console.error('[Jira Connect] tenant_info failed:', tenantRes.status)
            return NextResponse.json({ error: 'Could not reach Jira site. Check the site URL.' }, { status: 400 })
        }
        const tenantData = await tenantRes.json()
        const cloudId = tenantData.cloudId
        console.log('[Jira Connect] cloudId:', cloudId)

        if (!cloudId) {
            return NextResponse.json({ error: 'Could not find cloudId for the Jira site.' }, { status: 400 })
        }

        // Step 2: Validate credentials by calling /myself
        const credentials = Buffer.from(`${email}:${apiToken}`).toString('base64')
        const myselfRes = await fetch(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`, {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Accept': 'application/json'
            }
        })

        if (!myselfRes.ok) {
            const errText = await myselfRes.text()
            console.error('[Jira Connect] Auth validation failed:', myselfRes.status, errText)
            return NextResponse.json({ error: 'Invalid Jira credentials. Check your email and API token.' }, { status: 401 })
        }

        const myselfData = await myselfRes.json()
        console.log('[Jira Connect] Validated as:', myselfData.displayName, myselfData.accountId)

        // Step 3: Save to database (store apiToken as accessToken, email as refreshToken for retrieval)
        await prisma.userIntegration.upsert({
            where: {
                userId_platform: {
                    userId,
                    platform: 'jira'
                }
            },
            update: {
                accessToken: apiToken,
                refreshToken: email, // store email here for basic auth
                workspaceId: cloudId,
                projectId: null,
                projectName: null,
                expiresAt: null, // API tokens don't expire
                updatedAt: new Date()
            },
            create: {
                userId,
                platform: 'jira',
                accessToken: apiToken,
                refreshToken: email,
                workspaceId: cloudId,
                expiresAt: null,
            }
        })

        console.log('[Jira Connect] Saved to database successfully!')
        return NextResponse.json({
            success: true,
            displayName: myselfData.displayName,
            cloudId
        })
    } catch (error: any) {
        console.error('[Jira Connect] Error:', error.message || error)
        return NextResponse.json({ error: 'Failed to connect Jira.' }, { status: 500 })
    }
}
