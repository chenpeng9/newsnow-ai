import type { NewsItem } from "@shared/types"
import { scoreWithAI } from "../utils/llm"

const HIGH_VALUE_THRESHOLD = 70

export type AICategory = "AI动态" | "财经市场" | "全球视点"

export interface ScoredItem extends NewsItem {
  aiScore: number
  aiCategory?: AICategory
  articleContent?: string  // Cached article content from L3 fetching
}

/**
 * Score news items using AI (L3 layer)
 * Returns items with their AI scores and categories
 */
export async function scoreItems(items: NewsItem[]): Promise<ScoredItem[]> {
  const results: ScoredItem[] = []
  const total = items.length

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const source = (item as any).extra?.info || "未知来源"
    try {
      const { score, category, articleContent } = await scoreWithAI(item.title, item.url)
      results.push({
        ...item,
        aiScore: score,
        aiCategory: category,
        articleContent,
      })

      // Log each item's score with source info
      console.log(`[L3] ${i + 1}/${total} | 分数:${score} | 分类:${category || "无"} | 来源:${source} | ${(item as any).title?.slice(0, 50)}...`)

      // Log progress every 10 items
      if ((i + 1) % 10 === 0 || i + 1 === total) {
        console.log(`[L3] Progress: ${i + 1}/${total} (${Math.round((i + 1) / total * 100)}%)`)
      }
    } catch (error) {
      console.error("[L3] Failed to score item:", item.title, error)
      results.push({
        ...item,
        aiScore: 0,
        aiCategory: undefined,
        articleContent: undefined,
      })
    }
  }

  // Log summary by source
  const bySource: Record<string, { total: number; highValue: number }> = {}
  for (const item of results) {
    const src = (item as any).extra?.info || "未知来源"
    if (!bySource[src]) bySource[src] = { total: 0, highValue: 0 }
    bySource[src].total++
    if (item.aiScore >= HIGH_VALUE_THRESHOLD) bySource[src].highValue++
  }
  console.log("[L3] ===== 按来源统计 =====")
  for (const [src, stats] of Object.entries(bySource)) {
    console.log(`[L3] ${src}: 总计${stats.total}条, 高价值(>=70)${stats.highValue}条`)
  }

  return results
}

/**
 * Get high value items (score >= 70)
 */
export function getHighValueItems(items: ScoredItem[]): ScoredItem[] {
  return items.filter((item) => item.aiScore >= HIGH_VALUE_THRESHOLD)
}

/**
 * Sort items by AI score descending
 */
export function sortByScore(items: ScoredItem[]): ScoredItem[] {
  return [...items].sort((a, b) => b.aiScore - a.aiScore)
}
