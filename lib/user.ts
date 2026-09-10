import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Retrieves a user by Clerk ID from Prisma.
 * If the user does not exist in the database (e.g. webhook was missed, delayed, or unconfigured),
 * it fetches the user details dynamically from Clerk and creates the record automatically.
 */
export async function getOrCreateUser(userId: string) {
    if (!userId) return null;

    let user = await prisma.user.findUnique({
        where: { clerkId: userId }
    });

    if (!user) {
        let email: string | null = null;
        let name: string = "User";

        try {
            const clerkUser = await currentUser();
            if (clerkUser) {
                email = clerkUser.emailAddresses?.[0]?.emailAddress || null;
                const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
                name = fullName || clerkUser.username || (email ? email.split('@')[0] : 'User');
            }
        } catch (error) {
            console.warn("[getOrCreateUser] Could not retrieve Clerk user details:", error);
        }

        try {
            user = await prisma.user.upsert({
                where: { clerkId: userId },
                update: {},
                create: {
                    id: userId,
                    clerkId: userId,
                    email: email,
                    name: name
                }
            });
            console.log(`[getOrCreateUser] Successfully auto-created DB record for user ${userId}`);
        } catch (dbError) {
            console.error("[getOrCreateUser] Database upsert failed:", dbError);
            user = await prisma.user.findUnique({
                where: { clerkId: userId }
            });
        }
    }

    return user;
}
