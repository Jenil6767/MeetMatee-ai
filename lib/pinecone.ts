import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
})

const index = pinecone.index(process.env.PINECONE_INDEX_NAME!)

export async function saveManyVectors(vectors: Array<{
    id: string
    embedding: number[]
    metadata: any
}>) {
    const upsertData = vectors.map(v => {
        // Pinecone metadata values must be string, number, boolean, or list of strings (never null or undefined)
        const cleanMetadata: Record<string, any> = {}
        if (v.metadata) {
            for (const [key, value] of Object.entries(v.metadata)) {
                if (value !== null && value !== undefined) {
                    cleanMetadata[key] = value
                }
            }
        }

        return {
            id: v.id,
            values: v.embedding,
            metadata: cleanMetadata
        }
    })

    await index.upsert(upsertData)
}

export async function searchVectors(
    embedding: number[],
    filter: any = {},
    topK: number = 5
) {
    const result = await index.query({
        vector: embedding,
        filter,
        topK,
        includeMetadata: true
    })

    return result.matches || []
}
