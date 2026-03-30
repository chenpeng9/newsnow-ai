import { getPushedNewsTable } from "../../database/pushed-news"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const limit = Number(query.limit) || 10
    const offset = Number(query.offset) || 0
    const category = query.category as string | undefined
    const startDate = query.startDate as string | undefined
    const endDate = query.endDate as string | undefined

    const pushedNewsTable = await getPushedNewsTable()
    if (!pushedNewsTable) {
      throw createError({
        statusCode: 500,
        message: "Database not available",
      })
    }

    const groups = await pushedNewsTable.getGroupedByDate({
      limit,
      offset,
      category,
      startDate,
      endDate,
    })

    // Get total count for pagination
    const allStats = await pushedNewsTable.getStats()
    const total = allStats.total

    return {
      groups,
      total,
      hasMore: offset + groups.length < total,
    }
  } catch (error) {
    console.error("[API] Intel history error:", error)
    throw createError({
      statusCode: 500,
      message: "Failed to fetch intel history",
    })
  }
})
