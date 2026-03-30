import { useQuery } from "@tanstack/react-query"

export interface DateGroup {
  date: string
  count: number
  items: IntelNewsItem[]
  stats: {
    total: number
    sourceCount: number
  }
}

export interface IntelNewsItem {
  id: string
  url: string
  title: string
  pubDate: number
  extra?: {
    info?: string
    date?: number
  }
  aiScore: number
  aiSummary?: string
  aiComment?: string
  aiCategory?: AICategory
}

export type AICategory = "AI动态" | "财经市场" | "全球视点"

export interface IntelHistoryResponse {
  groups: DateGroup[]
  total: number
  hasMore: boolean
}

export interface IntelDailyResponse {
  date: string
  categories: Record<string, IntelNewsItem[]>
  stats: {
    total: number
    sourceCount: number
  }
}

export interface UseIntelHistoryOptions {
  limit?: number
  offset?: number
  category?: string
  startDate?: string
  endDate?: string
}

/**
 * Fetch intel history grouped by date
 */
export function useIntelHistory(options: UseIntelHistoryOptions = {}) {
  const { limit = 10, offset = 0, category, startDate, endDate } = options

  return useQuery({
    queryKey: ["intel-history", limit, offset, category, startDate, endDate],
    queryFn: async (): Promise<IntelHistoryResponse> => {
      const params = new URLSearchParams()
      if (limit) params.set("limit", String(limit))
      if (offset) params.set("offset", String(offset))
      if (category) params.set("category", category)
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)

      const response = await fetch(`/api/intel/history?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch intel history")
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Fetch intel for a specific date
 */
export function useIntelDaily(date: string) {
  return useQuery({
    queryKey: ["intel-daily", date],
    queryFn: async (): Promise<IntelDailyResponse> => {
      const response = await fetch(`/api/intel/daily/${date}`)
      if (!response.ok) {
        throw new Error("Failed to fetch daily intel")
      }
      return response.json()
    },
    enabled: !!date,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
