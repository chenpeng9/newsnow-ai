import { Link } from "@tanstack/react-router"

export interface Digest {
  id: string
  date: string
  title: string
  content: string
  summary: string
  categories: {
    AI动态?: Array<{
      id: string
      title: string
      url: string
      aiScore: number
      aiCategory?: string
      articleContent?: string
      pubDate?: number
      extra?: { info?: string; date?: number }
    }>
    财经市场?: Array<{
      id: string
      title: string
      url: string
      aiScore: number
      aiCategory?: string
      articleContent?: string
      pubDate?: number
      extra?: { info?: string; date?: number }
    }>
    全球视点?: Array<{
      id: string
      title: string
      url: string
      aiScore: number
      aiCategory?: string
      articleContent?: string
      pubDate?: number
      extra?: { info?: string; date?: number }
    }>
  }
  createdAt: number
}

interface DigestCardProps {
  digest: Digest
}

const categoryIcons: Record<string, string> = {
  AI动态: "🤖",
  财经市场: "💰",
  全球视点: "🌍",
}

export function DigestCard({ digest }: DigestCardProps) {
  // Format date to Chinese format
  const formattedDate = new Date(digest.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Count items by category
  const aiCount = digest.categories.AI动态?.length || 0
  const financeCount = digest.categories.财经市场?.length || 0
  const globalCount = digest.categories.全球视点?.length || 0

  return (
    <Link
      to="/intel/digest/$id"
      params={{ id: digest.id }}
      className="block digest-card mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-4 px-4 py-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          📰 {formattedDate}
        </h3>
      </div>

      {/* Summary */}
      {digest.summary && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">
          {digest.summary}
        </p>
      )}

      {/* Category counts */}
      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
        {aiCount > 0 && (
          <span className="flex items-center gap-1">
            <span>{categoryIcons["AI动态"]}</span>
            <span>AI动态 {aiCount}</span>
          </span>
        )}
        {financeCount > 0 && (
          <span className="flex items-center gap-1">
            <span>{categoryIcons["财经市场"]}</span>
            <span>财经市场 {financeCount}</span>
          </span>
        )}
        {globalCount > 0 && (
          <span className="flex items-center gap-1">
            <span>{categoryIcons["全球视点"]}</span>
            <span>全球视点 {globalCount}</span>
          </span>
        )}
      </div>

      {/* Read more link */}
      <div className="mt-3 text-sm text-primary font-medium flex items-center gap-1">
        阅读全文 →
      </div>
    </Link>
  )
}
