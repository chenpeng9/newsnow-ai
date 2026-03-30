import { eventHandler, getQuery } from "h3"
import { getPushedNewsTable } from "#/database/pushed-news"

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 10
  const offset = Number(query.offset) || 0

  const pushedNewsTable = await getPushedNewsTable()
  if (!pushedNewsTable) {
    throw createError({
      statusCode: 500,
      message: "Database not available",
    })
  }

  const digests = await pushedNewsTable.getRecentDigests(limit, offset)

  return {
    digests,
    hasMore: digests.length === limit,
  }
})
