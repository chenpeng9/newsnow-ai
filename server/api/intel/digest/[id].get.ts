import { eventHandler, getRouterParam } from "h3"
import { getPushedNewsTable } from "#/database/pushed-news"

export default eventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Digest ID is required",
    })
  }

  const pushedNewsTable = await getPushedNewsTable()
  if (!pushedNewsTable) {
    throw createError({
      statusCode: 500,
      message: "Database not available",
    })
  }

  const digest = await pushedNewsTable.getDigestById(id)
  if (!digest) {
    throw createError({
      statusCode: 404,
      message: "Digest not found",
    })
  }

  return digest
})
