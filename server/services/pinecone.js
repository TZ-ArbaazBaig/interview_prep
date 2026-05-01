/**
 * In-memory JD store — replaces Pinecone for local dev.
 * Pinecone SDK v7 rejects hash-based embeddings; this gives
 * reliable RAG retrieval without any external vector DB dependency.
 */

// sessionId → array of text chunks
const jdStore = new Map()

// Split text into meaningful chunks
function chunkText(text) {
  // Try double-newline paragraph splitting first
  let paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 30)

  // Fallback: split by single newlines
  if (paragraphs.length === 0) {
    paragraphs = text.split(/\n/).filter(p => p.trim().length > 30)
  }

  // Last resort: whole text as one chunk
  if (paragraphs.length === 0 && text.trim().length > 20) {
    paragraphs = [text.trim()]
  }

  const chunks = []
  for (const para of paragraphs) {
    if (para.length > 500) {
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para]
      let current = ''
      for (const sentence of sentences) {
        if ((current + sentence).length > 400) {
          if (current) chunks.push(current.trim())
          current = sentence
        } else {
          current += ' ' + sentence
        }
      }
      if (current) chunks.push(current.trim())
    } else {
      chunks.push(para.trim())
    }
  }
  return chunks.filter(c => c.length > 20)
}

// Simple keyword-based relevance score
function scoreChunk(chunk, query) {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const chunkLower = chunk.toLowerCase()
  let score = 0
  for (const word of queryWords) {
    if (chunkLower.includes(word)) score++
  }
  return score
}

async function storeJobDescription(sessionId, jobDescription) {
  const chunks = chunkText(jobDescription)
  console.log(`[RAG Store] Storing ${chunks.length} chunks for session ${sessionId}`)
  jdStore.set(sessionId.toString(), chunks)
  return chunks.length
}

async function retrieveRelevantChunks(sessionId, query, topK = 3) {
  const chunks = jdStore.get(sessionId.toString())

  if (!chunks || chunks.length === 0) {
    console.warn(`[RAG Store] No chunks found for session ${sessionId}`)
    return []
  }

  // Score and sort chunks by keyword relevance
  const scored = chunks
    .map(chunk => ({ chunk, score: scoreChunk(chunk, query) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk)

  // If no keyword matches, return the first topK chunks as fallback
  if (scored.length === 0) {
    return chunks.slice(0, topK)
  }

  return scored
}

async function deleteSessionVectors(sessionId) {
  jdStore.delete(sessionId.toString())
}

module.exports = {
  storeJobDescription,
  retrieveRelevantChunks,
  deleteSessionVectors
}
