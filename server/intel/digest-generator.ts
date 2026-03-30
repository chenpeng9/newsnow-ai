import type { ScoredItem, AICategory } from "./filter"
import { callLLM } from "../utils/llm"

export interface DigestOutput {
  title: string
  content: string
  summary: string
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
 * Format news item for AI prompt
 */
function formatNewsItem(item: ScoredItem, index: number): string {
  const source = item.extra?.info || "未知来源"
  return `[${index}] **${item.title}** (来源: ${source}, 分数: ${item.aiScore})
摘要: ${item.aiSummary || "无"}
点评: ${item.aiComment || "无"}`
}

/**
 * Call DeepSeek API to generate digest article
 */
async function generateDigestContent(input: DigestInput): Promise<{
  title: string
  content: string
  summary: string
}> {
  const { aiDynamics, financeMarket, globalPerspectives, date } = input

  // Build news items by category
  const aiItems = aiDynamics.map((item, i) => formatNewsItem(item, i + 1)).join("\n\n")
  const financeItems = financeMarket.map((item, i) => formatNewsItem(item, i + 1)).join("\n\n")
  const globalItems = globalPerspectives.map((item, i) => formatNewsItem(item, i + 1)).join("\n\n")

  const systemPrompt = `你是一位专业的科技财经编辑。请根据以下新闻生成一篇汇总文章。

要求：
1. 文章分为三个部分：AI动态、财经市场、全球视点
2. 每个部分用 2-3 个段落总结当天最重要的新闻，进行事实性归纳和串联
3. 使用事实陈述，避免主观评论
4. 提到具体的新闻事件时，标注来源序号 [1][2][3]
5. 总字数控制在 800-1000 字
6. 使用 Markdown 格式输出

输出格式：
# {title}

## AI动态
{content}

## 财经市场
{content}

## 全球视点
{content}

最后，请生成一段 200 字以内的推送摘要，格式为：
摘要: {summary}`

  let userPrompt = `日期: ${date}\n\n`

  if (aiDynamics.length > 0) {
    userPrompt += `### AI动态 (${aiDynamics.length}条)\n${aiItems}\n\n`
  }

  if (financeMarket.length > 0) {
    userPrompt += `### 财经市场 (${financeMarket.length}条)\n${financeItems}\n\n`
  }

  if (globalPerspectives.length > 0) {
    userPrompt += `### 全球视点 (${globalPerspectives.length}条)\n${globalItems}\n\n`
  }

  userPrompt += "请根据以上新闻生成汇总文章："

  try {
    const result = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ])

    // Parse the response
    const summaryMatch = result.match(/摘要:\s*(.+)/s)
    const summary = summaryMatch ? summaryMatch[1].trim() : result.slice(0, 200)

    // Generate title
    const title = `${date} AI 情报汇总`

    return {
      title,
      content: result,
      summary,
    }
  } catch (error) {
    console.error("[Digest] Failed to generate digest content:", error)
    throw error
  }
}

/**
 * Main function to generate digest
 */
export async function generateDigest(input: DigestInput): Promise<DigestOutput & { id: string }> {
  const { date } = input
  const id = generateDigestId(date)

  console.log("[Digest] Generating digest for date:", date)

  // Generate digest content using AI
  const { title, content, summary } = await generateDigestContent(input)

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
