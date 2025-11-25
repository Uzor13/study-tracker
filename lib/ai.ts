import { GoogleGenerativeAI } from '@google/generative-ai'

// Lazy initialization to avoid throwing error at module load time
let genAI: GoogleGenerativeAI | null = null

function getGenAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set')
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }
  return genAI
}

/**
 * Get Gemini Pro model for text generation
 */
export function getGeminiModel() {
  return getGenAI().getGenerativeModel({ model: 'gemini-pro' })
}

/**
 * Analyze a document (SOP, CV, etc.) and provide feedback
 */
export async function analyzeDocument(
  documentText: string,
  documentType: 'sop' | 'cv' | 'letter'
): Promise<{
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  grammar: string[]
  clarity: string[]
}> {
  const model = getGeminiModel()

  const prompts = {
    sop: `You are an expert visa application consultant. Analyze this Statement of Purpose (SOP) for a Canadian study permit application.

Document:
${documentText}

Provide a comprehensive analysis in the following JSON format:
{
  "score": <number 0-100>,
  "feedback": "<overall assessment>",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "grammar": ["grammar issue 1", "grammar issue 2", ...],
  "clarity": ["clarity issue 1", "clarity issue 2", ...]
}

Evaluate based on:
1. Clear purpose and motivation
2. Academic and career goals alignment
3. Financial preparedness mentions
4. Ties to home country
5. Grammar and writing quality
6. Professional tone
7. Specific details about chosen program
8. Convincing reasons to return home after studies

Be constructive and specific.`,
    cv: `You are an expert resume/CV consultant. Analyze this CV/Resume for a Canadian study permit or job application.

Document:
${documentText}

Provide a comprehensive analysis in the following JSON format:
{
  "score": <number 0-100>,
  "feedback": "<overall assessment>",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "grammar": ["grammar issue 1", "grammar issue 2", ...],
  "clarity": ["clarity issue 1", "clarity issue 2", ...]
}

Evaluate based on:
1. Professional formatting and structure
2. Clear contact information
3. Relevant education details
4. Work experience quality and relevance
5. Skills and achievements
6. Grammar and language quality
7. Quantifiable accomplishments
8. Appropriate length

Be constructive and specific.`,
    letter: `You are an expert document reviewer. Analyze this letter for a visa application.

Document:
${documentText}

Provide a comprehensive analysis in the following JSON format:
{
  "score": <number 0-100>,
  "feedback": "<overall assessment>",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...],
  "grammar": ["grammar issue 1", "grammar issue 2", ...],
  "clarity": ["clarity issue 1", "clarity issue 2", ...]
}

Evaluate based on:
1. Professional tone and formatting
2. Clear purpose and message
3. Supporting evidence and details
4. Grammar and language quality
5. Appropriate length
6. Credibility and authenticity

Be constructive and specific.`,
  }

  const result = await model.generateContent(prompts[documentType])
  const response = await result.response
  const text = response.text()

  try {
    // Extract JSON from response (Gemini sometimes wraps it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }

    const analysis = JSON.parse(jsonMatch[0])
    return analysis
  } catch (error) {
    console.error('Error parsing AI response:', error)
    throw new Error('Failed to parse document analysis')
  }
}

/**
 * Chat with visa assistant trained on IRCC guidelines
 */
export async function chatWithAssistant(
  message: string,
  chatHistory: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> {
  const model = getGeminiModel()

  const systemPrompt = `You are a helpful Canadian visa assistant with expertise in IRCC (Immigration, Refugees and Citizenship Canada) guidelines. You help users with:

1. Study Permit applications and requirements
2. Work Permit information
3. Permanent Residence pathways
4. Tourist/Visitor visa questions
5. Document requirements and checklist
6. Timeline and processing times
7. Biometrics, medical exams, police certificates
8. Post-arrival information (SIN, health card, bank accounts)
9. Student rights and work permissions

Guidelines:
- Provide accurate, up-to-date information based on IRCC policies
- Be friendly, clear, and concise
- If unsure, recommend checking official IRCC website
- Personalize advice based on user's degree type and situation
- Use simple language to explain complex immigration terms
- Always encourage users to verify information on official sources

Common Topics:
- Study Permit: LOA required, show proof of funds (CAD $20,635/year + tuition), biometrics, medical exam if needed
- Processing Time: 8-12 weeks for study permits (can vary by country)
- Work Rights: Students can work 20hrs/week during studies, full-time during breaks
- Post-Graduation Work Permit (PGWP): 8 months - 3 years depending on program length
- SIN Number: Apply within weeks of arrival for work eligibility
- Provincial Health Insurance: Wait 3 months in most provinces (get private insurance meanwhile)

Current conversation:`

  // Format chat history for the model
  const formattedHistory = chatHistory.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.text }],
  }))

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  })

  const result = await chat.sendMessage(systemPrompt + '\n\nUser: ' + message)
  const response = await result.response
  return response.text()
}

/**
 * Generate personalized checklist based on user profile
 */
export async function generatePersonalizedChecklist(
  degreeType: 'undergrad' | 'masters' | 'phd',
  country: string,
  intakeSeason: 'september' | 'january' | 'may'
): Promise<string[]> {
  const model = getGeminiModel()

  const prompt = `Generate a personalized visa application checklist for a ${degreeType} student from ${country} planning to study in Canada with ${intakeSeason} intake.

Consider:
- Degree-specific requirements (undergrad vs. masters vs. phd)
- Country-specific document requirements
- Timeline based on intake season
- Common issues students from ${country} face

Return ONLY a JSON array of checklist items as strings, no additional text:
["item 1", "item 2", "item 3", ...]

Keep it practical, specific, and actionable. Include 15-20 items covering:
1. Academic documents
2. Financial proof
3. Language tests
4. Visa application steps
5. Pre-departure tasks`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  try {
    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Invalid response format')
    }

    const checklist = JSON.parse(jsonMatch[0])
    return checklist
  } catch (error) {
    console.error('Error parsing AI response:', error)
    // Return fallback checklist
    return [
      'Research and select Canadian schools',
      'Prepare academic transcripts and certificates',
      'Take language proficiency test (IELTS/TOEFL)',
      'Apply to universities before deadlines',
      'Secure Letter of Acceptance (LOA)',
      'Gather financial proof documents',
      'Apply for study permit online',
      'Complete biometrics at VAC',
      'Attend medical examination if required',
      'Prepare for visa interview if called',
    ]
  }
}
