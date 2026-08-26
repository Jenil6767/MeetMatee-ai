import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

function getS3Client() {
    const region = process.env.AWS_REGION || 'us-east-1'
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    if (!accessKeyId || !secretAccessKey) {
        throw new Error('AWS credentials missing (AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY)')
    }

    return new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    })
}

/**
 * Downloads a file from a public URL and uploads it to our own AWS S3 bucket.
 * Returns the permanent S3 URL.
 */
export async function uploadUrlToS3(fileUrl: string, meetingId: string): Promise<string> {
    const bucketName = process.env.S3_BUCKET_NAME || 'meetmatee'
    const region = process.env.AWS_REGION || 'us-east-1'

    console.log(`[S3] Downloading file from ${fileUrl} for meeting ${meetingId}`)
    
    // 1. Fetch the file from the remote URL (Meeting BaaS)
    const response = await fetch(fileUrl)
    if (!response.ok) {
        throw new Error(`Failed to fetch remote file: ${response.statusText}`)
    }

    // 2. Load into memory buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 3. Generate a safe S3 Key (filename)
    const fileName = `recordings/${meetingId}-${Date.now()}.mp4`

    console.log(`[S3] Uploading ${buffer.length} bytes to S3 bucket ${bucketName} as ${fileName}`)

    // 4. Upload to S3
    const s3 = getS3Client()
    const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'video/mp4'
    })

    await s3.send(uploadCommand)

    // 5. Construct the public AWS URL
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`
    console.log(`[S3] Successfully uploaded to: ${publicUrl}`)

    return publicUrl
}
