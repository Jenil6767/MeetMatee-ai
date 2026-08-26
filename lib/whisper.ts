import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

const MAX_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB hard limit from OpenAI

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface WhisperWord {
    word: string
    start: number
    end: number
}

export interface WhisperSegment {
    speaker: string
    offset: number
    words: WhisperWord[]
}

export interface WhisperResult {
    text: string
    segments: WhisperSegment[]
    language?: string
    duration?: number
    /** true when the file exceeded 25 MB and was skipped — caller should fall back */
    skippedDueToSize: boolean
}

// ─── Public API ─────────────────────────────────────────────────────────────────

/**
 * Download audio from a URL (e.g. the S3 mp4 link from Meeting BaaS)
 * and transcribe it with OpenAI Whisper.
 *
 * Returns `skippedDueToSize: true` when the file is > 25 MB so the
 * caller can fall back to the Meeting BaaS transcript safely.
 */
export async function transcribeFromUrl(audioUrl: string): Promise<WhisperResult> {
    console.log('[Whisper] Downloading audio from:', audioUrl)

    let response: Response
    try {
        response = await fetch(audioUrl)
    } catch (fetchErr) {
        throw new Error(`[Whisper] Could not reach audio URL: ${(fetchErr as Error).message}`)
    }

    if (!response.ok) {
        throw new Error(
            `[Whisper] Failed to download audio — HTTP ${response.status} ${response.statusText}`
        )
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const sizeMB = (buffer.length / (1024 * 1024)).toFixed(1)

    console.log(`[Whisper] Audio downloaded: ${sizeMB} MB`)

    // If the file is too large for Whisper, signal the caller to use fallback
    if (buffer.length > MAX_SIZE_BYTES) {
        console.warn(
            `[Whisper] File is ${sizeMB} MB — exceeds the 25 MB Whisper limit. ` +
            `Falling back to Meeting BaaS transcript.`
        )
        return { text: '', segments: [], skippedDueToSize: true }
    }

    // Strip query params / signed URL tokens to get the clean extension
    const cleanPath = audioUrl.split('?')[0]
    const ext = cleanPath.split('.').pop()?.toLowerCase() || 'mp4'

    return _transcribeBuffer(buffer, ext)
}

// ─── Internal ─────────────────────────────────────────────────────────────────

async function _transcribeBuffer(buffer: Buffer, ext: string): Promise<WhisperResult> {
    const mimeMap: Record<string, string> = {
        mp3:  'audio/mpeg',
        wav:  'audio/wav',
        m4a:  'audio/m4a',
        ogg:  'audio/ogg',
        flac: 'audio/flac',
        webm: 'audio/webm',
        mp4:  'video/mp4',
    }
    const mimeType = mimeMap[ext] ?? 'video/mp4'
    const filename = `recording.${ext}`

    console.log(`[Whisper] Sending to Whisper API (${filename}, ${mimeType})…`)

    const audioFile = new File([buffer], filename, { type: mimeType })

    const transcription = await openai.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioFile,
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
    })

    console.log(
        `[Whisper] Transcription complete — ` +
        `${transcription.segments?.length ?? 0} segments, ` +
        `language: ${transcription.language}, ` +
        `duration: ${transcription.duration?.toFixed(0)}s`
    )

    // Convert Whisper segments → TranscriptDisplay-compatible format
    // Whisper doesn't do speaker diarization, so all text is "Speaker 1"
    const segments: WhisperSegment[] = (transcription.segments ?? []).map((seg: any) => {
        const words = seg.text
            .trim()
            .split(/\s+/)
            .filter(Boolean)

        const wordDuration = words.length > 0
            ? (seg.end - seg.start) / words.length
            : 0

        return {
            speaker: 'Speaker 1',
            offset: seg.start ?? 0,
            words: words.map((word: string, wi: number) => ({
                word,
                start: seg.start + wi * wordDuration,
                end: seg.start + (wi + 1) * wordDuration,
            })),
        }
    })

    return {
        text: transcription.text ?? '',
        segments,
        language: transcription.language ?? undefined,
        duration: transcription.duration ?? undefined,
        skippedDueToSize: false,
    }
}
