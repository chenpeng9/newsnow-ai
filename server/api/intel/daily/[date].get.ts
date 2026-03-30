import { getPushedNewsTable } from "../../../database/pushed-news"
import type { ScoredItem } from "../../../intel/filter"

export default defineEventHandler(async (event) => {
  try {
    const date = getRouterParam(event, "date")

    if (!date) {
      throw createError({
        statusCode: 400,
        message: "Date parameter is required",
      })
    }

    const pushedNewsTable = await getPushedNewsTable()
    if (!pushedNewsTable) {
      throw createError({
        statusCode: 500,
        message: "Database not available",
      })
    }

    const items = await pushedNewsTable.getByDate(date)
    const stats = await pushedNewsTable.getStats(date)

    // Group items by category
    const categories: Record<string, ScoredItem[]> = {
      "AI动态": [],
      "财经市场": [],
      "全球视点": [],
    }

    for (const item of items) {
      const category = item.aiCategory
      if (category && categories[category]) {
        categories[category].push(item)
      }
    }

    return {
      date,
      categories,
      stats,
    }
  } catch (error) {
    console.error("[API] Intel daily error:", error)
    throw createError({
      statusCode: 500,
      message: "Failed to fetch daily intel",
    })
  }
})
