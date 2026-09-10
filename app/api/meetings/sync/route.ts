import { prisma } from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "not authenticated" }, { status: 401 });
        }

        const user = await getOrCreateUser(userId);

        if (!user || !user.calendarConnected || !user.googleAccessToken) {
            return NextResponse.json({ error: "calendar not connected" }, { status: 400 });
        }

        let accessToken = user.googleAccessToken;
        const now = new Date();
        const tokenExpiry = user.googleTokenExpiry ? new Date(user.googleTokenExpiry) : new Date(0);
        const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

        if (tokenExpiry <= tenMinutesFromNow) {
            if (!user.googleRefreshToken) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { calendarConnected: false, googleAccessToken: null }
                });
                return NextResponse.json({ error: "refresh token missing" }, { status: 400 });
            }

            const response = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    refresh_token: user.googleRefreshToken,
                    grant_type: 'refresh_token'
                })
            });

            const tokens = await response.json();
            if (!tokens.access_token) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { calendarConnected: false }
                });
                return NextResponse.json({ error: "failed to refresh token" }, { status: 401 });
            }

            accessToken = tokens.access_token;
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    googleAccessToken: tokens.access_token,
                    googleTokenExpiry: new Date(Date.now() + (tokens.expires_in * 1000))
                }
            });
        }

        const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
            `timeMin=${now.toISOString()}&` +
            `timeMax=${sevenDays.toISOString()}&` +
            `singleEvents=true&orderBy=startTime&showDeleted=true`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { calendarConnected: false }
                });
            }
            return NextResponse.json({ error: "calendar api failed" }, { status: 500 });
        }

        const data = await response.json();
        const events = data.items || [];
        const existingEvents = await prisma.meeting.findMany({
            where: {
                userId: user.id,
                isFromCalendar: true,
                startTime: { gte: now }
            }
        });

        const googleEventIds = new Set<string>();
        for (const event of events) {
            if (event.status === 'cancelled') {
                const existingMeeting = await prisma.meeting.findUnique({
                    where: { calendarEventId: event.id }
                });
                if (existingMeeting) {
                    await prisma.meeting.delete({ where: { calendarEventId: event.id } });
                }
                continue;
            }

            googleEventIds.add(event.id);

            const meetingUrl = event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri;
            if (!meetingUrl || !event.start?.dateTime) continue;

            const eventData = {
                userId: user.id,
                title: event.summary || 'Untitled Meeting',
                description: event.description || null,
                meetingUrl: meetingUrl,
                startTime: new Date(event.start.dateTime),
                endTime: new Date(event.end.dateTime),
                attendees: event.attendees ? JSON.stringify(event.attendees.map((a: any) => a.email)) : null,
                isFromCalendar: true,
            };

            const existingMeeting = await prisma.meeting.findUnique({
                where: { calendarEventId: event.id }
            });

            if (existingMeeting) {
                await prisma.meeting.update({
                    where: { calendarEventId: event.id },
                    data: eventData
                });
            } else {
                await prisma.meeting.create({
                    data: {
                        ...eventData,
                        calendarEventId: event.id,
                        botScheduled: true
                    }
                });
            }
        }

        const deletedEvents = existingEvents.filter(dbEvent => dbEvent.calendarEventId && !googleEventIds.has(dbEvent.calendarEventId));
        if (deletedEvents.length > 0) {
            for (const deletedEvent of deletedEvents) {
                await prisma.meeting.delete({ where: { id: deletedEvent.id } });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('sync error:', error);
        return NextResponse.json({ error: "internal server error" }, { status: 500 });
    }
}
