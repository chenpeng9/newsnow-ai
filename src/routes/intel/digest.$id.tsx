import { createFileRoute, Link } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import type { Digest } from "~/components/intel/digest-card"

export const Route = createFileRoute("/intel/digest/$id")({
  component: DigestDetailComponent,
})

function DigestDetailComponent() {
  const { id } = Route.useParams()
  const [digest, setDigest] = useState<Digest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDigest() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/intel/digest/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch digest")
        }
        const data = await response.json()
        setDigest(data)
      } catch (err) {
        console.error("[Digest] Error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDigest()
  }, [id])

  // Format date to Chinese format
  const formattedDate = digest
    ? new Date(digest.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  const categoryIcons: Record<string, string> = {
    AI动态: "🤖",
    财经市场: "💰",
    全球视点: "🌍",
  }

  const categoryOrder: Array<"AI动态" | "财经市场" | "全球视点"> = ["AI动态", "财经市场", "全球视点"]

  // Render markdown content (simple implementation)
  const renderMarkdown = (content: string, items: Digest['categories']['AI动态']) => {
    // Build a map of index to URL for linking
    const allItems = [
      ...(items?.AI动态 || []),
      ...(items?.财经市场 || []),
      ...(items?.全球视点 || []),
    ]
    const indexToUrl: Record<number, string> = {}
    allItems.forEach((item, idx) => {
      indexToUrl[idx + 1] = item.url
    })

    // Convert markdown headers to HTML
    let html = content
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-3 text-neutral-900 dark:text-neutral-100">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4 text-neutral-900 dark:text-neutral-100">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-neutral-900 dark:text-neutral-100">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      // Convert [1] to clickable links
      .replace(/\[(\d+)\]/g, (_, num) => {
        const index = parseInt(num, 10)
        const url = indexToUrl[index]
        if (url) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-xs text-primary hover:underline font-mono">[${num}]</a>`
        }
        return `<sup class="text-xs text-primary">[${num}]</sup>`
      })
      .replace(/\n\n/g, '</p><p class="my-3 text-neutral-700 dark:text-neutral-300">')
      .replace(/\n/g, '<br />')

    return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />
  }

  // Format publish date
  const formatPublishDate = (item: Digest['categories']['AI动态'][0]) => {
    // Try pubDate first, then fall back to extra.date
    const timestamp = item.pubDate || item.extra?.date
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleString("zh-CN", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="intel-page max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/intel"
          className={$([
            "text-neutral-500 dark:text-neutral-500",
            "hover:text-neutral-700 dark:hover:text-neutral-300",
            "transition-colors",
          ])}
        >
          ← 返回
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex-1">
          📰 {formattedDate} AI 情报汇总
        </h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-neutral-500 dark:text-neutral-500">加载中...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500 dark:text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && digest && (
        <div className="space-y-8">
          {/* Digest Content */}
          <div className="prose dark:prose-invert max-w-none">
            {renderMarkdown(digest.content, digest.categories)}
          </div>

          {/* Source Links */}
          {categoryOrder.some(cat => digest.categories[cat]?.length > 0) && (
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                相关新闻
              </h2>

              <div className="space-y-4">
                {categoryOrder.map(category => {
                  const items = digest.categories[category]
                  if (!items || items.length === 0) return null

                  return (
                    <div key={category} className="category-section">
                      <h3 className="text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                        <span>{categoryIcons[category]}</span>
                        <span>{category}</span>
                      </h3>

                      <div className="space-y-2">
                        {items.map((item, itemIdx) => {
                          // Calculate global index across all categories
                          let globalIndex = itemIdx + 1
                          if (category === "财经市场") {
                            globalIndex += (digest.categories.AI动态?.length || 0)
                          } else if (category === "全球视点") {
                            globalIndex += (digest.categories.AI动态?.length || 0)
                            globalIndex += (digest.categories.财经市场?.length || 0)
                          }

                          return (
                            <div
                              key={item.id}
                              className="flex items-start gap-2 text-sm p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors"
                            >
                              {/* 序号 */}
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-mono text-primary hover:underline shrink-0 w-6 pt-0.5"
                              >
                                [{globalIndex}]
                              </a>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-0"
                              >
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="flex-1 text-neutral-700 dark:text-neutral-300">
                                    {item.title}
                                  </span>
                                  <span className="text-xs font-mono text-primary shrink-0">
                                    {item.aiScore}分
                                  </span>
                                  {item.extra?.info && (
                                    <span className="text-xs text-blue-500 dark:text-blue-400 shrink-0">
                                      {item.extra.info}
                                    </span>
                                  )}
                                  <span className="text-xs text-neutral-400 shrink-0">
                                    {formatPublishDate(item)}
                                  </span>
                                </div>
                              </a>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
