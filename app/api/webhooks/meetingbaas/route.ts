import { processMeetingTranscript } from "@/lib/ai-processor";
import { prisma } from "@/lib/db";
import { sendMeetingSummaryEmail } from "@/lib/email-service-free";
import { processTranscript } from "@/lib/rag";
import { uploadUrlToS3 } from "@/lib/s3";
import { transcribeFromUrl } from "@/lib/whisper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const webhook = await request.json()

        if (webhook.event === 'complete') {
            const webhookData = webhook.data

            const meeting = await prisma.meeting.findFirst({
                where: {
                    botId: webhookData.bot_id
                },
                include: {
                    user: true
                }
            })

            if (!meeting) {
                console.error('meeting not found for bot id:', webhookData.bot_id)
                return NextResponse.json({ error: 'meeting not found' }, { status: 404 })
            }

            if (!meeting.user.email) {
                console.error('user email not found for this meeting', meeting.id)
                return NextResponse.json({ error: 'user email not found' }, { status: 400 })
            }

            let finalRecordingUrl = webhookData.mp4 || null
            if (webhookData.mp4) {
                try {
                    // Upload the Meeting BaaS recording to our own S3 bucket
                    finalRecordingUrl = await uploadUrlToS3(webhookData.mp4, meeting.id)
                } catch (s3Error) {
                    console.error(`[Webhook] Failed to upload MP4 to S3 for meeting ${meeting.id}:`, s3Error)
                    // If S3 upload fails, fallback to using the original Meeting BaaS url
                    finalRecordingUrl = webhookData.mp4
                }
            }

            // ── Step 1: Save recording URL immediately so audio player works ──────
            await prisma.meeting.update({
                where: { id: meeting.id },
                data: {
                    meetingEnded: true,
                    recordingUrl: finalRecordingUrl,
                    speakers: webhookData.speakers || null,
                }
            })

            if (meeting.processed) {
                return NextResponse.json({
                    success: true,
                    message: 'meeting already processed',
                    meetingId: meeting.id
                })
            }

            // ── Step 2: Transcribe with Whisper (primary source) ──────────────────
            let finalTranscript: any = null  // what gets stored in DB
            let transcriptText = ''          // plain text for AI processing

            if (webhookData.mp4) {
                try {
                    console.log(`[Webhook] Attempting Whisper transcription for meeting ${meeting.id}`)
                    // Use finalRecordingUrl which is now our S3 bucket link
                    const whisperResult = await transcribeFromUrl(finalRecordingUrl)

                    if (!whisperResult.skippedDueToSize && whisperResult.text.trim().length > 0) {
                        // ✅ Whisper succeeded — use its output
                        finalTranscript = whisperResult.text       // Save raw text to DB instead of segments
                        transcriptText = whisperResult.text        // plain text for GPT/RAG
                        console.log(`[Webhook] Whisper transcription succeeded for meeting ${meeting.id}`)
                    } else {
                        console.warn(`[Webhook] Whisper returned empty or was skipped — falling back to Meeting BaaS transcript`)
                    }
                } catch (whisperError) {
                    console.error(`[Webhook] Whisper failed for meeting ${meeting.id}:`, whisperError)
                    // Fall through to Meeting BaaS fallback below
                }
            }

            // ── Step 3: Fallback to Meeting BaaS transcript if Whisper failed ─────
            if (!finalTranscript && webhookData.transcript) {
                console.log(`[Webhook] Using Meeting BaaS transcript as fallback for meeting ${meeting.id}`)
                finalTranscript = webhookData.transcript

                // Convert Meeting BaaS array format to plain text for AI
                if (Array.isArray(webhookData.transcript)) {
                    transcriptText = webhookData.transcript
                        .map((item: any) => `${item.speaker || 'Speaker'}: ${item.words.map((w: any) => w.word).join(' ')}`)
                        .join('\n')
                } else {
                    transcriptText = webhookData.transcript
                }
            }

            // ── Step 4: Save transcript to DB ─────────────────────────────────────
            await prisma.meeting.update({
                where: { id: meeting.id },
                data: {
                    transcriptReady: finalTranscript ? true : false,
                    transcript: finalTranscript || null,
                }
            })

            // ── Step 5: AI processing (summary + action items + email + RAG) ──────
            if (transcriptText.trim().length > 0) {
                try {
                    // Generate summary and action items via GPT-4o-mini
                    const processed = await processMeetingTranscript(transcriptText)

                    // Send summary email
                    try {
                        await sendMeetingSummaryEmail({
                            userEmail: meeting.user.email,
                            userName: meeting.user.name || 'User',
                            meetingTitle: meeting.title,
                            summary: processed.summary,
                            actionItems: processed.actionItems,
                            meetingId: meeting.id,
                            meetingDate: meeting.startTime.toLocaleDateString()
                        })

                        await prisma.meeting.update({
                            where: { id: meeting.id },
                            data: { emailSent: true, emailSentAt: new Date() }
                        })
                    } catch (emailError) {
                        console.error('failed to send the email:', emailError)
                    }

                    // Index transcript in Pinecone for RAG chat
                    await processTranscript(meeting.id, meeting.userId, transcriptText, meeting.title)

                    // Mark as fully processed
                    await prisma.meeting.update({
                        where: { id: meeting.id },
                        data: {
                            summary: processed.summary,
                            actionItems: processed.actionItems,
                            processed: true,
                            processedAt: new Date(),
                            ragProcessed: true,
                            ragProcessedAt: new Date()
                        }
                    })

                } catch (processingError) {
                    console.error('failed to process the transcript:', processingError)

                    await prisma.meeting.update({
                        where: { id: meeting.id },
                        data: {
                            processed: true,
                            processedAt: new Date(),
                            summary: 'processing failed. please check the transcript manually.',
                            actionItems: []
                        }
                    })
                }
            } else {
                // No transcript from either source — mark as processed so UI doesn't spin forever
                console.warn(`[Webhook] No transcript available for meeting ${meeting.id} from Whisper or Meeting BaaS`)
                await prisma.meeting.update({
                    where: { id: meeting.id },
                    data: {
                        processed: true,
                        processedAt: new Date(),
                        summary: 'No transcript was available for this meeting.',
                        actionItems: []
                    }
                })
            }

            return NextResponse.json({
                success: true,
                message: 'meeting processed successfully',
                meetingId: meeting.id
            })
        }

        return NextResponse.json({
            success: true,
            message: 'webhook received but no action needed'
        })
    } catch (error) {
        console.error('webhook processing error:', error)
        return NextResponse.json({ error: 'internal server error' }, { status: 500 })
    }
}