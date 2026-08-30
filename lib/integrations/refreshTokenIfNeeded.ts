import { UserIntegration } from "@prisma/client";
import { refreshAsanaToken } from "./asana/refreshToken";
import { refreshJiraToken } from "./jira/refreshToken";

export async function refreshTokenIfNeeded(integration: UserIntegration) {
    const now = new Date()
    const expiresAt = integration.expiresAt

    // Asana uses OAuth 2.0 with hourly expiring tokens
    if (integration.platform === 'asana' && integration.refreshToken) {
        if (!expiresAt || now >= new Date(expiresAt.getTime() - 5 * 60 * 1000)) {
            return await refreshAsanaToken(integration)
        }
    }

    // Jira only refreshes if it has an OAuth expiry (legacy OAuth); API token auth has no expiry
    if (integration.platform === 'jira' && integration.expiresAt) {
        if (now >= new Date(integration.expiresAt.getTime() - 5 * 60 * 1000)) {
            return await refreshJiraToken(integration)
        }
    }

    return integration
}