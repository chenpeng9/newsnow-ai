import type { ScoredItem } from "./filter-l3"
import type { AICategory } from "../utils/llm"
import { generateCategoryDigest, generatePushSummary } from "../utils/llm"

export interface DigestOutput {
  title: string
  content: string
  summary: string
  categories: {
    AI动态: ScoredItem[]
    财经市场: ScoredItem[]
    全球视点: ScoredItem[]
  }
}

export interface DigestInput {
  aiDynamics: ScoredItem[]
  financeMarket: ScoredItem[]
  globalPerspectives: ScoredItem[]
  date: string
}

/**
 * Generate a unique digest ID based on date and time
 */
function generateDigestId(date: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `digest-${date}-${timestamp}-${random}`
}

/**
 * Generate digest content for a single category
 */
async function generateCategoryContent(
  category: AICategory,
  items: ScoredItem[]
): Promise<string> {
  // Prepare items for LLM
  const itemsForLLM = items.map((item: ScoredItem) => ({
    title: item.title,
    url: item.url,
    aiScore: item.aiScore,
    articleContent: item.articleContent,
    extra: item.extra?.info ? { info: String(item.extra.info) } : undefined,
  }))

  return await generateCategoryDigest(category, itemsForLLM)
}

/**
 * Generate full digest content by processing each category separately
 */
async function generateDigestContent(input: DigestInput): Promise<{
  title: string
  content: string
}> {
  const { aiDynamics, financeMarket, globalPerspectives, date } = input

  // Generate each category separately (only if has items)
  const sections: string[] = []

  if (aiDynamics.length > 0) {
    const aiContent = await generateCategoryContent("AI动态", aiDynamics)
    sections.push(`## AI动态\n\n${aiContent}`)
  }

  if (financeMarket.length > 0) {
    const financeContent = await generateCategoryContent("财经市场", financeMarket)
    sections.push(`## 财经市场\n\n${financeContent}`)
  }

  if (globalPerspectives.length > 0) {
    const globalContent = await generateCategoryContent("全球视点", globalPerspectives)
    sections.push(`## 全球视点\n\n${globalContent}`)
  }

  // Generate title and combine content
  const title = `${date} AI 情报汇总`
  const content = `# ${title}\n\n${sections.join("\n\n")}`

  return { title, content }
}

/**
 * Main function to generate digest
 */
export async function generateDigest(input: DigestInput): Promise<DigestOutput & { id: string }> {
  const { date, aiDynamics, financeMarket, globalPerspectives } = input
  const id = generateDigestId(date)

  console.log("[Digest] Generating digest for date:", date)

  // Generate digest content by category
  const { title, content } = await generateDigestContent(input)

  // Generate push summary separately
  const summary = await generatePushSummary(content)

  console.log("[Digest] Generated digest:", {
    id,
    title,
    contentLength: content.length,
    summaryLength: summary.length,
  })

  return {
    id,
    title,
    content,
    summary,
    categories: {
      AI动态: aiDynamics,
      财经市场: financeMarket,
      全球视点: globalPerspectives,
    },
  }
}

/**
 * Filter items by score threshold (default: 70)
 */
export function filterByScore(items: ScoredItem[], threshold: number = 70): ScoredItem[] {
  return items.filter((item) => item.aiScore >= threshold)
}

/**
 * Group items by category
 */
export function groupByCategory(items: ScoredItem[]): Record<AICategory, ScoredItem[]> {
  const result: Record<string, ScoredItem[]> = {
    AI动态: [],
    财经市场: [],
    全球视点: [],
  }

  for (const item of items) {
    const category = item.aiCategory
    if (category && result[category]) {
      result[category].push(item)
    }
  }

  return result as Record<AICategory, ScoredItem[]>
}
