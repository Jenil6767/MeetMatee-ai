import { chatWithAllMeetings } from "../lib/rag"

async function testSlackPrompt() {
    const question = "Hello  tell me about my last meeting"
    console.log(`Testing Question: "${question}"`)
    const result = await chatWithAllMeetings(["user_3Gz8xbVIp6cejXLyUnoC73DZcJj"], question)
    console.log("\nResponse:\n", result.answer)
}

testSlackPrompt().catch(console.error)
