export interface Frontmatter {
  layout?: string
  title?: string
  mdn?: string
  [key: string]: unknown
}

export interface QuizData {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter
  content: string
  quizzes: QuizData[]
}

function parseQuizBlock(quizText: string): QuizData | null {
  let question = ""
  const options: string[] = []
  let correctIndex = 0
  let explanation = ""
  let currentField: "none" | "question" | "options" | "explanation" = "none"

  for (const line of quizText.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith("question:")) {
      question = trimmed.replace(/^question:\s*/, "").trim()
      currentField = "question"
    } else if (trimmed.startsWith("options:")) {
      currentField = "options"
    } else if (trimmed.startsWith("explanation:")) {
      explanation = trimmed.replace(/^explanation:\s*/, "").trim()
      currentField = "explanation"
    } else if (currentField === "options" && trimmed.startsWith("-")) {
      let optionText = trimmed.substring(1).trim()
      if (optionText.includes("(correct)")) {
        optionText = optionText.replace("(correct)", "").trim()
        correctIndex = options.length
      }
      options.push(optionText)
    } else if (currentField === "question") {
      question += ` ${trimmed}`
    } else if (currentField === "explanation") {
      explanation += ` ${trimmed}`
    }
  }

  if (!question || options.length === 0) return null
  return { question, options, correctIndex, explanation: explanation || undefined }
}

export function parseMarkdown(rawContent: string): ParsedMarkdown {
  const frontmatter: Frontmatter = {}
  let content = rawContent
  const quizzes: QuizData[] = []

  const frontmatterRegex = /^---([\s\S]*?)---/
  const fmMatch = rawContent.match(frontmatterRegex)
  if (fmMatch) {
    content = content.replace(frontmatterRegex, "").trim()
    for (const line of fmMatch[1].split("\n")) {
      const separatorIndex = line.indexOf(":")
      if (separatorIndex === -1) continue
      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()
      frontmatter[key] = value
    }
  }

  const quizRegex = /:::quiz([\s\S]*?):::/g
  content = content.replace(quizRegex, (_match, quizText: string) => {
    const quiz = parseQuizBlock(quizText)
    if (quiz) quizzes.push(quiz)
    return ""
  }).trim()

  return { frontmatter, content, quizzes }
}
