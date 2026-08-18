import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ meetingId: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "not authenticated" }, { status: 401 });
        }

        const { meetingId } = await params;

        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { user: { select: { clerkId: true } } }
        });

        if (!meeting) {
            return NextResponse.json({ error: "meeting not found" }, { status: 404 });
        }

        // Only owner can stream audio
        if (meeting.user.clerkId !== userId) {
            return NextResponse.json({ error: "not authorized" }, { status: 403 });
        }

        if (!meeting.recordingUrl) {
            return NextResponse.json({ error: "no recording available" }, { status: 404 });
        }

        // Proxy the request to the S3 URL, forwarding the Range header for seeking
        const rangeHeader = request.headers.get("range");
        const headers: Record<string, string> = {};
        if (rangeHeader) {
            headers["Range"] = rangeHeader;
        }

        const s3Response = await fetch(meeting.recordingUrl, { headers });

        if (!s3Response.ok && s3Response.status !== 206) {
            return NextResponse.json(
                { error: "failed to fetch recording from storage" },
                { status: 502 }
            );
        }

        const responseHeaders = new Headers();
        responseHeaders.set("Content-Type", s3Response.headers.get("Content-Type") || "video/mp4");
        const contentLength = s3Response.headers.get("Content-Length");
        if (contentLength) responseHeaders.set("Content-Length", contentLength);
        const contentRange = s3Response.headers.get("Content-Range");
        if (contentRange) responseHeaders.set("Content-Range", contentRange);
        responseHeaders.set("Accept-Ranges", "bytes");
        // Cache for 1 hour
        responseHeaders.set("Cache-Control", "private, max-age=3600");

        return new NextResponse(s3Response.body, {
            status: s3Response.status,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("audio proxy error:", error);
        return NextResponse.json({ error: "failed to stream audio" }, { status: 500 });
    }
}
