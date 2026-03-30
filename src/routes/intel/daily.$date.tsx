import { createFileRoute, Link } from "@tanstack/react-router"
import { useIntelDaily } from "~/hooks/use-intel-history"

export const Route = createFileRoute("/intel/daily/$date")({
  component: DailyComponent,
})

function DailyComponent() {
  const { date } = Route.useParams()
  const { data, isLoading, error } = useIntelDaily(date)

  // Format date to Chinese format
  const formattedDate = new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const categoryIcons: Record<string, string> = {
    AI动态: "🤖",
    财经市场: "💰",
    全球视点: "🌍",
  }

  const categoryOrder: Array<"AI动态" | "财经市场" | "全球视点"> = ["AI动态", "财经市场", "全球视点"]

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
          {formattedDate}
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
            加载失败，请稍后重试
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && data && (
        <>
          {/* Stats */}
          <div className="mb-6 px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              从 {data.stats.total} 条资讯中筛选 · {data.stats.sourceCount} 个渠道
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {categoryOrder.map(category => {
              const items = data.categories[category]
              if (!items || items.length === 0) return null

              return (
                <div key={category} className="category-section">
                  <h2 className="text-lg font-bold mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span>{categoryIcons[category]}</span>
                    <span>{category}</span>
                    <span className="text-sm font-normal text-neutral-500 dark:text-neutral-500">
                      ({items.length}条)
                    </span>
                  </h2>

                  <div className="space-y-4">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="news-item p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-primary transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-0"
                          >
                            <h3 className="font-semibold text-base text-neutral-800 dark:text-neutral-200 flex items-center gap-2 mb-2">
                              <span className="flex-1">{item.title}</span>
                              <span className="text-xs font-mono text-primary shrink-0">
                                {item.aiScore}分
                              </span>
                            </h3>

                            <div className="text-xs text-neutral-500 dark:text-neutral-500 flex gap-2">
                              {item.extra?.info && (
                                <span>来源：{item.extra.info}</span>
                              )}
                              {item.pubDate && (
                                <>
                                  {item.extra?.info && <span>·</span>}
                                  <span>
                                    {new Date(item.pubDate).toLocaleString("zh-CN", {
                                      month: "numeric",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </>
                              )}
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {categoryOrder.every(cat => !data.categories[cat] || data.categories[cat].length === 0) && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-neutral-500 dark:text-neutral-500 mb-2">
                该日期暂无数据
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
