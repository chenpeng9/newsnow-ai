import { useQuery } from "@tanstack/react-query"
import type { Digest } from "~/components/intel/digest-card"

interface DigestsResponse {
  digests: Digest[]
  hasMore: boolean
}

export function useDigests(options: {
  limit?: number
  offset?: number
} = {}) {
  const { limit = 10, offset = 0 } = options

  return useQuery<DigestsResponse>({
    queryKey: ["digests", limit, offset],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      })
      const response = await fetch(`/api/intel/digests?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch digests")
      }
      return response.json()
    },
  })
}
