const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Generate 10 interview questions based on a job description
 * @param {string} jobDescription 
 * @returns {Promise<Array>}
 */
const generateQuestions = async (jobDescription) => {
  const prompt = `
You are a senior technical interviewer with 10 years of experience at top tech companies.

Given this job description:
[JOB DESCRIPTION START]
${jobDescription}
[JOB DESCRIPTION END]

    Generate exactly 10 interview questions tailored to this specific role.
    If the input is absolutely not a job description, return an object with an "error" key.
    Otherwise, return an object with a "questions" key containing the array of questions.

    Return ONLY a valid JSON object. No extra text.

    Each question in the "questions" array must have:
    - "question": clear, specific question text
    - "difficulty": "easy", "medium", or "hard"
    - "category": "technical", "behavioral", or "system-design"  
    - "hint": one sentence help

    Rules:
    - Mix difficulties: 3 easy, 4 medium, 3 hard
    - Behavioral questions use "Tell me about a time..."

    Return format:
    { "questions": [{"question":"...","difficulty":"easy","category":"technical","hint":"..."}] }
    `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      temperature: 0.7,
      response_format: { type: 'json_object' } // Groq supports JSON mode for some models
    });

    let content = completion.choices[0]?.message?.content;
    
    // Safety check for markdown blocks
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/, '').replace(/\n?```/, '');
    }

    const parsed = JSON.parse(content);
    
    // If AI identified this is not a job description
    if (parsed.error && !Array.isArray(parsed)) {
      throw new Error(parsed.error);
    }

    // If it returned an object with a questions key, handle it
    return Array.isArray(parsed) ? parsed : (parsed.questions || []);
  } catch (error) {
    console.error('Groq Question Generation Error:', error);
    // If it's a validation error we threw manually, pass it through
    if (error.message.includes('job description')) {
      throw error;
    }
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
};

/**
 * Evaluate a user's answer to an interview question
 * @param {string} question 
 * @param {string} answer 
 * @returns {Promise<Object>}
 */
const evaluateAnswer = async (question, answer) => {
  const prompt = `
You are an experienced technical interviewer evaluating a candidate's answer.

Interview Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer and return ONLY a valid JSON object with no extra text.

{
  "score": [integer 1-10],
  "feedback": "[2-3 sentences of specific, constructive feedback about what was good and what was missing]",
  "betterAnswer": "[A model answer that would score 9-10, written as if the candidate is speaking]"
}

Scoring guide:
1-3: Very poor, missing core concepts
4-5: Basic understanding but incomplete
6-7: Good answer with minor gaps
8-9: Strong, comprehensive answer  
10: Exceptional, beyond expectations
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    let content = completion.choices[0]?.message?.content;
    
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/, '').replace(/\n?```/, '');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Groq Evaluation Error:', error);
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
};

module.exports = {
  generateQuestions,
  evaluateAnswer
};
