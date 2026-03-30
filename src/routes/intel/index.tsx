import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useDigests } from "~/hooks/use-digests"
import { DigestCard } from "~/components/intel/digest-card"

export const Route = createFileRoute("/intel/")({
  component: IntelComponent,
})

function IntelComponent() {
  const [page, setPage] = useState(0)
  const pageSize = 10

  const { data, isLoading, error, isFetching } = useDigests({
    limit: pageSize,
    offset: page * pageSize,
  })

  const handleLoadMore = () => {
    setPage(p => p + 1)
  }

  return (
    <div className="intel-page max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          📰 AI 情报汇总
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

      {/* Empty State */}
      {!isLoading && !error && data?.digests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-neutral-500 dark:text-neutral-500 mb-2">
            暂无汇总文章
          </div>
          <div className="text-sm text-neutral-400 dark:text-neutral-600">
            等待每日情报推送...
          </div>
        </div>
      )}

      {/* Digest List */}
      {!isLoading && !error && data && data.digests.length > 0 && (
        <>
          <div className="space-y-4">
            {data.digests.map(digest => (
              <DigestCard key={digest.id} digest={digest} />
            ))}
          </div>

          {/* Load More Button */}
          {data.hasMore && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isFetching}
                className={$([
                  "px-6 py-2 rounded-lg",
                  "text-sm font-medium",
                  "bg-primary/10 text-primary",
                  "hover:bg-primary/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-colors",
                ])}
              >
                {isFetching ? "加载中..." : "加载更多"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
