import type { Subject, EducationLevel, QuestionType, Difficulty, Problem } from '@/data/content'
import { GoogleGenAI } from "@google/genai"

export interface GeneratedQuestion extends Omit<Problem, 'id'> {
  id: string
}

export async function generateQuestions(
  subject: Subject,
  educationLevel: EducationLevel,
  questionType: QuestionType,
  difficulty: Difficulty,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Generate ${count} educational questions for a ${educationLevel} student studying ${subject}.

Requirements:
- Subject: ${subject}
- Education Level: ${educationLevel}
- Question Type: ${questionType}
- Difficulty: ${difficulty}
- Format: Return valid JSON array of question objects

Each question object should have this structure:
{
  "id": "unique-id",
  "title": "Brief question title",
  "statement": "The actual question text",
  "placeholder": "Hint text for input (optional)",
  "answer": "Correct answer",
  "steps": ["Step 1 explanation", "Step 2 explanation", ...],
  "difficulty": "${difficulty}",
  "tags": ["relevant", "tags"],
  "acceptance": 75,
  "questionType": "${questionType}",
  "educationLevel": ["${educationLevel}"],
  ${questionType === 'MCQ' ? '"options": ["Option A", "Option B", "Option C", "Option D"],' : ''}
  "passage": "${questionType === 'Comprehension' ? 'Reading passage text here' : ''}"
}

Guidelines:
- Make questions age-appropriate for ${educationLevel} level
- Ensure mathematical accuracy for Maths questions
- Include practical examples for Coding questions
- Cover fundamental concepts for Science questions
- For MCQ: Include 4 options with one correct answer
- For Comprehension: Include a short passage and question
- For Integer: Questions requiring numerical answers
- Difficulty ${difficulty}: ${
    difficulty === 'Easy' ? 'Basic concepts, straightforward' :
    difficulty === 'Medium' ? 'Moderate complexity, some reasoning required' :
    'Advanced concepts, complex problem-solving'
  }

Return ONLY the JSON array, no additional text.`

  try {
    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    })

    const text = response.text

    if (!text) {
      throw new Error('No response from AI')
    }

    // Clean the response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()

    const questions = JSON.parse(cleanedText) as GeneratedQuestion[]

    // Validate and ensure all required fields
    return questions.map(q => ({
      ...q,
      id: q.id || `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      educationLevel: [educationLevel],
      questionType,
      difficulty
    }))

  } catch (error) {
    console.error('AI question generation failed:', error)
    throw new Error('Failed to generate questions. Please try again.')
  }
}

export async function generateSingleQuestion(
  subject: Subject,
  educationLevel: EducationLevel,
  questionType: QuestionType,
  difficulty: Difficulty
): Promise<GeneratedQuestion> {
  const questions = await generateQuestions(subject, educationLevel, questionType, difficulty, 1)
  return questions[0]
}