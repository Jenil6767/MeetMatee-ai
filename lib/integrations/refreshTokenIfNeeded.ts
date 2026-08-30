import { UserIntegration } from "@prisma/client";
import { refreshAsanaToken } from "./asana/refreshToken";
import { refreshJiraToken } from "./jira/refreshToken";

export async function refreshTokenIfNeeded(integration: UserIntegration) {
    const now = new Date()
    const expiresAt = integration.expiresAt

    // API tokens (e.g. Jira API Token) do not have an expiration and don't need refreshing
    if (!expiresAt) {
        return integration
    }

    if (now >= new Date(expiresAt.getTime() - 5 * 60 * 1000)) {
        switch (integration.platform) {
            case 'jira':
                return await refreshJiraToken(integration)
            case 'asana':
                return await refreshAsanaToken(integration)
            default:
                return integration
        }
    }

    return integration
}