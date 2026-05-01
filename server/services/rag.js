const { retrieveRelevantChunks, storeJobDescription } = require('./pinecone')
const Groq = require('groq-sdk')
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

/**
 * Answer a question using RAG over the job description.
 * If in-memory chunks are missing (e.g. server restarted),
 * we re-hydrate from the jobDescription passed in.
 */
async function answerWithRAG(sessionId, userQuestion, jobTitle, jobDescription) {
  // Step 1: Try to retrieve relevant chunks from in-memory store
  let relevantChunks = await retrieveRelevantChunks(sessionId, userQuestion)

  // Step 2: If store was wiped (server restart), re-populate from MongoDB JD
  if (relevantChunks.length === 0 && jobDescription) {
    console.log(`[RAG] Re-hydrating store for session ${sessionId} from MongoDB...`)
    await storeJobDescription(sessionId, jobDescription)
    relevantChunks = await retrieveRelevantChunks(sessionId, userQuestion)
  }

  // Step 3: Still nothing — return a graceful fallback
  if (relevantChunks.length === 0) {
    return {
      answer: "I couldn't find specific details in the job description to answer that. Could you try rephrasing or asking something else about the role?",
      chunksUsed: 0
    }
  }

  // Step 4: Build context from retrieved chunks  
  const context = relevantChunks.join('\n\n---\n\n')

  // Step 5: Send to Groq with context
  const prompt = `You are an elite career intelligence analyst. You are analyzing a job description for a candidate.

JOB DOSSIER: ${jobTitle}

SCANNED CONTEXT FROM DESCRIPTION:
${context}

CANDIDATE QUERY: ${userQuestion}

INSTRUCTIONS:
1. Answer based ONLY on the provided context above.
2. If the information is not in the context, state that clearly and suggest what the user might look for instead.
3. Keep the tone professional, direct, and helpful.
4. Maximum 3 concise sentences.`

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 300
    })

    return {
      answer: response.choices[0].message.content,
      chunksUsed: relevantChunks.length
    }
  } catch (err) {
    console.error('RAG Generation Error:', err)
    throw new Error('Failed to generate AI response from context.')
  }
}

module.exports = { answerWithRAG }
