import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

// Whisper API hard limit is 25 MB
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

const SUPPORTED_FORMATS = [
    'audio/mp4',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/webm',
    'audio/ogg',
    'audio/flac',
    'audio/m4a',
    'audio/x-m4a',
    'video/mp4',
    'video/webm',
]

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'You must be logged in to use Whisper transcription.' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('audio') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No audio file provided. Please upload an audio or video file.' },
                { status: 400 }
            )
        }

        // Size check
        if (file.size > MAX_FILE_SIZE_BYTES) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
            return NextResponse.json(
                {
                    error: `File is too large (${sizeMB} MB). Whisper supports files up to 25 MB. Please compress or trim your audio.`,
                },
                { status: 413 }
            )
        }

        // Format check (loose — Whisper is flexible, but gives a clear error)
        const mimeType = file.type
        const isSupported = SUPPORTED_FORMATS.some((fmt) => mimeType.startsWith(fmt.split('/')[0]))
        if (!mimeType || !isSupported) {
            return NextResponse.json(
                {
                    error: `Unsupported file type "${mimeType || 'unknown'}". Supported formats: MP3, MP4, WAV, M4A, WebM, OGG, FLAC.`,
                },
                { status: 415 }
            )
        }

        // Convert to a proper File object with correct name for OpenAI SDK
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Ensure the filename has an extension the API accepts
        const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
        const filename = `recording.${ext}`
        const audioFile = new File([buffer], filename, { type: file.type })

        // Call Whisper with verbose_json to get word-level timestamps
        const transcription = await openai.audio.transcriptions.create({
            model: 'whisper-1',
            file: audioFile,
            response_format: 'verbose_json',
            timestamp_granularities: ['segment'],
        })

        // Build segments compatible with TranscriptDisplay format
        const segments = (transcription.segments ?? []).map((seg: any, index: number) => ({
            speaker: `Speaker ${Math.floor(index / 3) + 1}`, // rough speaker grouping
            offset: seg.start ?? 0,
            words: seg.text
                .trim()
                .split(' ')
                .filter(Boolean)
                .map((word: string, wi: number) => {
                    const wordDuration = ((seg.end - seg.start) / seg.text.trim().split(' ').length)
                    return {
                        word,
                        start: seg.start + wi * wordDuration,
                        end: seg.start + (wi + 1) * wordDuration,
                    }
                }),
            text: seg.text.trim(),
        }))

        return NextResponse.json({
            success: true,
            text: transcription.text,
            language: transcription.language,
            duration: transcription.duration,
            segments,
        })
    } catch (error: any) {
        console.error('Whisper transcription error:', error)

        // Friendly OpenAI API errors
        if (error?.status === 400) {
            return NextResponse.json(
                { error: 'Whisper could not read this file. Make sure it contains actual audio content.' },
                { status: 400 }
            )
        }

        if (error?.status === 429) {
            return NextResponse.json(
                { error: 'OpenAI rate limit reached. Please wait a moment and try again.' },
                { status: 429 }
            )
        }

        return NextResponse.json(
            { error: 'Transcription failed. Please try again with a different file.' },
            { status: 500 }
        )
    }
}
