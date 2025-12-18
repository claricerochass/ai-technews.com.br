import { generateText } from "ai"

export interface GeneratedSummary {
  dev: string
  design: string
  product: string
}

// Validar e sanitizar entrada
function validateInput(title: string, description: string): boolean {
  if (!title || !description) return false
  if (title.length > 500 || description.length > 2000) return false
  return true
}

// Prompt templates por persona
const PERSONA_PROMPTS = {
  dev: `You are a software developer. Summarize this article in ONE sentence from a developer's perspective. 
Focus on: implementation, technology, code, tools, architecture, frameworks.
Article Title: "{title}"
Article: "{description}"
Summary:`,

  design: `You are a product designer. Summarize this article in ONE sentence from a designer's perspective.
Focus on: UX/UI, user experience, visual design, components, prototyping, accessibility.
Article Title: "{title}"
Article: "{description}"
Summary:`,

  product: `You are a product manager. Summarize this article in ONE sentence from a product manager's perspective.
Focus on: market fit, strategy, business impact, user value, growth, metrics, competitiveness.
Article Title: "{title}"
Article: "{description}"
Summary:`,
}

export async function generateAISummaries(title: string, description: string): Promise<GeneratedSummary | null> {
  if (!validateInput(title, description)) {
    return null
  }

  try {
    const summaryPromises = Object.entries(PERSONA_PROMPTS).map(([persona, template]) =>
      generateSummaryForPersona(persona as keyof typeof PERSONA_PROMPTS, template, title, description),
    )

    const [dev, design, product] = await Promise.race([
      Promise.all(summaryPromises),
      new Promise<[null, null, null]>(
        (resolve) => setTimeout(() => resolve([null, null, null]), 8000), // 8 second timeout
      ),
    ])

    if (!dev || !design || !product) {
      return null
    }

    return { dev, design, product }
  } catch (error) {
    console.error("Error generating AI summaries:", error)
    return null
  }
}

async function generateSummaryForPersona(
  persona: keyof typeof PERSONA_PROMPTS,
  template: string,
  title: string,
  description: string,
): Promise<string | null> {
  try {
    const prompt = template
      .replace("{title}", title.slice(0, 200)) // Limit title length
      .replace("{description}", description.slice(0, 500)) // Limit description length

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.7,
      maxTokens: 100, // Keep summaries short
      system: "You are a professional summarizer. Generate concise, one-sentence summaries. Be direct and insightful.",
    })

    return text.trim().slice(0, 150) // Limit output
  } catch (error) {
    console.error(`Error generating ${persona} summary:`, error)
    return null
  }
}
