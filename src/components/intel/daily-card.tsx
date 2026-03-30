import { Link } from "@tanstack/react-router"
import type { DateGroup } from "~/hooks/use-intel-history"

interface DailyCardProps {
  group: DateGroup
}

const categoryIcons: Record<string, string> = {
  AI动态: "🤖",
  财经市场: "💰",
  全球视点: "🌍",
}

export function DailyCard({ group }: DailyCardProps) {
  const { date, items, stats } = group

  // Format date to Chinese format
  const formattedDate = new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="daily-card mb-12 pb-8 border-b border-zinc-200 dark:border-zinc-800">
      <h3 className="date-header text-lg font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        {formattedDate}
      </h3>

      <div className="news-list space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="news-item">
            <Link
              to="/intel/daily/$date"
              params={{ date }}
              className="block"
            >
              <div className="flex items-start gap-2">
                <span className="text-xs text-neutral-400 font-mono mt-0.5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="news-title font-semibold text-base text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                    <span className="flex-1 truncate">{item.title}</span>
                    <span className="text-xs font-mono text-primary shrink-0">
                      {item.aiScore}分
                    </span>
                  </h4>
                  {item.aiSummary && (
                    <p className="news-summary text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                      {item.aiSummary}
                    </p>
                  )}
                  {item.extra?.info && (
                    <div className="news-meta text-xs text-neutral-500 dark:text-neutral-500 mt-2 flex gap-2">
                      <span>来源：{item.extra.info}</span>
                      {item.aiCategory && (
                        <>
                          <span>·</span>
                          <span>{categoryIcons[item.aiCategory] || ""} {item.aiCategory}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
          <span>从 {stats.total} 条资讯中筛选 · {stats.sourceCount} 个渠道</span>
          <Link
            to="/intel/daily/$date"
            params={{ date }}
            className="text-primary hover:underline flex items-center gap-1"
          >
            查看详情 →
          </Link>
        </div>
      </div>
    </div>
  )
}
