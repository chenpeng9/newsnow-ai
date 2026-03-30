import type { ScoredItem } from "../intel/filter"
import { intelCategories } from "@shared/intel-categories"
import { getters } from "../getters"
import { processIntel } from "../intel/filter"
import type { NewsItem } from "@shared/types"
import process from "node:process"
import { getPushedNewsTable } from "../database/pushed-news"
import { generateDigest, filterByScore, groupByCategory, type DigestInput } from "../intel/digest-generator"

// Daily briefing times: [hour, minute]
const BRIEFING_TIMES = [
  [8, 30],   // 08:30
  [20, 0],   // 20:00
]
const CONCURRENCY_LIMIT = 5 // Max concurrent source fetches

// Freshness filter: only push news published within last 12 hours
const FRESHNESS_WINDOW_MS = 12 * 60 * 60 * 1000 // 12 hours in milliseconds

// Score threshold for digest (70 instead of 80)
const DIGEST_SCORE_THRESHOLD = 70

// Base URL for digest links
const DIGEST_BASE_URL = process.env.DIGEST_BASE_URL || "https://news.eiden.top"

// Detect environment: 'production' for Docker, 'development' for local
const NODE_ENV = process.env.NODE_ENV || process.env.BUILD_ENV || "development"
const isProduction = NODE_ENV === "production" || process.env.CF_PAGES === "1"

/**
 * Get webhook URL based on environment
 * Production: uses production webhook
 * Development: uses test webhook, falls back to production if test not configured
 */
function getWebhookUrl(type: "feishu" | "wecom"): string {
  const upperType = type.toUpperCase() as "FEISHU" | "WECOM"

  if (isProduction) {
    // Production: always use production webhook
    const webhook = process.env[`${upperType}_WEBHOOK`]
    if (!webhook) {
      console.warn(`[Webhook] Production webhook for ${type} not configured`)
    }
    return webhook || ""
  }

  // Development: try test webhook first, then production
  const testWebhook = process.env[`${upperType}_TEST_WEBHOOK`]
  const prodWebhook = process.env[`${upperType}_WEBHOOK`]

  if (testWebhook) {
    console.log(`[Webhook] Using TEST webhook for ${type}`)
    return testWebhook
  }

  if (prodWebhook) {
    console.warn(`[Webhook] No test webhook for ${type}, falling back to PRODUCTION`)
  }

  return prodWebhook || ""
}

// Concurrency lock to prevent duplicate execution
let isBriefingRunning = false

/**
 * Run tasks with concurrency limit
 */
async function parallelFetch<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<NewsItem[]>
): Promise<NewsItem[]> {
  const results: NewsItem[][] = []

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        try {
          const result = await fn(item)
          return result
        } catch (error) {
          console.error(`[Briefing] Fetch error:`, error)
          return []
        }
      })
    )
    results.push(...batchResults)
  }

  return results.flat()
}

/**
 * Generate daily briefing content
 */
export async function generateDailyBriefing(): Promise<{
  date: string
  sourceIds: string[]
  allItems: NewsItem[]
  scored: ScoredItem[]
}> {
  const currentTime = new Date()
  const dateStr = currentTime.toISOString().split("T")[0]

  // Get all source IDs from A category only (深度/专业级)
  const categories = [intelCategories.A]
  const sourceIds = categories.flatMap((c) => c.sources)

  console.log(`[Briefing] Fetching from ${sourceIds.length} sources (concurrency: ${CONCURRENCY_LIMIT})...`)

  // Fetch all sources with concurrency limit
  const allItems = await parallelFetch(
    sourceIds,
    CONCURRENCY_LIMIT,
    async (sourceId: string): Promise<NewsItem[]> => {
      const getter = getters[sourceId as keyof typeof getters]
      if (!getter) {
        console.warn(`[Briefing] Unknown source: ${sourceId}`)
        return []
      }
      const items = await getter()
      console.log(`[Briefing] Fetched ${sourceId}: ${Array.isArray(items) ? items.length : 0} items`)
      return Array.isArray(items) ? items : []
    }
  )

  // Process through AI filter
  const scored = await processIntel(allItems)

  // Sort by score
  const sorted = [...scored].sort((a, b) => b.aiScore - a.aiScore)

  // Filter by freshness (within last 12 hours) before AI category filter
  const freshItems = sorted.filter((item) => {
    const publishTime = item.pubDate || item.extra?.date
    if (!publishTime) return false
    // Try to parse date from various formats
    const publishDate = typeof publishTime === 'string'
      ? new Date(publishTime).getTime()
      : (publishTime as number) || 0

    return currentTime.getTime() as number - publishDate <= FRESHNESS_WINDOW_MS
  })

  console.log(`[Briefing] Freshness filter: ${sorted.length} → ${freshItems.length} items (removed ${sorted.length - freshItems.length} old news)`)

  // Filter out already pushed news (by URL)
  const pushedNewsTable = await getPushedNewsTable()
  let unpushedItems = freshItems
  if (pushedNewsTable) {
    const freshUrls = freshItems.map((item) => item.url).filter(Boolean)
    const pushedUrls = await pushedNewsTable.getPushedUrls(freshUrls)
    unpushedItems = freshItems.filter((item) => !pushedUrls.has(item.url))
    console.log(`[Briefing] Already pushed filter: ${freshItems.length} → ${unpushedItems.length} items (removed ${pushedUrls.size} already pushed)`)
  }

  return {
    date: dateStr,
    sourceIds,
    allItems,
    scored: unpushedItems,
  }
}

/**
 * Build Feishu interactive card for digest
 */
function buildFeishuDigestCard(digest: { title: string; summary: string; date: string; digestUrl: string }): object {
  return {
    msg_type: "interactive",
    card: {
      header: {
        title: {
          tag: "plain_text",
          content: `📰 今日 AI 情报汇总`,
        },
        template: "blue",
      },
      elements: [
        {
          tag: "div",
          text: {
            tag: "lark_md",
            content: `**${digest.date}**\n\n${digest.summary}`,
          },
        },
        {
          tag: "hr",
        },
        {
          tag: "action",
          actions: [
            {
              tag: "button",
              text: {
                tag: "plain_text",
                content: "阅读全文",
              },
              type: "primary",
              url: digest.digestUrl,
            },
          ],
        },
      ],
    },
  }
}

/**
 * Build WeCom markdown content for digest
 */
function buildWeComDigestContent(digest: { title: string; summary: string; date: string; digestUrl: string }): string {
  return `📰 今日 AI 情报汇总
${digest.date}

${digest.summary}

🔗 阅读全文: ${digest.digestUrl}

---
由 早8🌞晚8🌛 AI推送`
}

/**
 * Send daily briefing to webhooks
 */
export async function sendDailyBriefing(): Promise<void> {
  // Check if briefing is already running (concurrency lock)
  if (isBriefingRunning) {
    console.log("[Briefing] Already running, skipping...")
    return
  }

  isBriefingRunning = true
  try {
    const briefing = await generateDailyBriefing()

    console.log("[Briefing] Generated briefing:", {
      date: briefing.date,
      total: briefing.scored.length,
    })

    // Filter by score threshold (70 instead of 80)
    const filtered = filterByScore(briefing.scored, DIGEST_SCORE_THRESHOLD)
    console.log(`[Briefing] Filtered by score >= ${DIGEST_SCORE_THRESHOLD}: ${filtered.length} items`)

    // Group by category
    const grouped = groupByCategory(filtered)
    console.log("[Briefing] Grouped by category:", {
      AI动态: grouped["AI动态"].length,
      财经市场: grouped["财经市场"].length,
      全球视点: grouped["全球视点"].length,
    })

    // Generate digest
    const digestInput: DigestInput = {
      aiDynamics: grouped["AI动态"],
      financeMarket: grouped["财经市场"],
      globalPerspectives: grouped["全球视点"],
      date: briefing.date,
    }

    const digest = await generateDigest(digestInput)
    const digestUrl = `${DIGEST_BASE_URL}/intel/digest/${digest.id}`

    console.log("[Briefing] Generated digest:", {
      id: digest.id,
      title: digest.title,
      summaryLength: digest.summary.length,
    })

    // Save digest to database
    const pushedNewsTable = await getPushedNewsTable()
    if (pushedNewsTable) {
      await pushedNewsTable.saveDigest({
        id: digest.id,
        date: briefing.date,
        title: digest.title,
        content: digest.content,
        summary: digest.summary,
        categories: {
          AI动态: grouped["AI动态"],
          财经市场: grouped["财经市场"],
          全球视点: grouped["全球视点"],
        },
      })

      // Mark all items as pushed
      const allItems = [...filtered]
      if (allItems.length > 0) {
        await pushedNewsTable.markBatchAsPushed(allItems)
        await pushedNewsTable.markWithDigest(allItems, digest.id)
        console.log(`[Briefing] Marked ${allItems.length} items as pushed with digest_id ${digest.id}`)
      }
    }

    // Send to Feishu (card format)
    const feishuWebhook = getWebhookUrl("feishu")
    if (feishuWebhook) {
      const { myFetch } = await import("../utils/fetch")
      const card = buildFeishuDigestCard({
        title: digest.title,
        summary: digest.summary,
        date: briefing.date,
        digestUrl,
      })

      try {
        const response = await myFetch(feishuWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(card),
        })
        console.log("[Briefing] Feishu digest card sent, response:", response)
      } catch (error: any) {
        console.error("[Briefing] Feishu error:", error?.message || error)
      }
    }

    // Send to WeCom (markdown_v2 format)
    const wecomWebhook = getWebhookUrl("wecom")
    if (wecomWebhook) {
      const { myFetch } = await import("../utils/fetch")
      const content = buildWeComDigestContent({
        title: digest.title,
        summary: digest.summary,
        date: briefing.date,
        digestUrl,
      })

      console.log("[Briefing] WeCom digest content length:", content.length)

      try {
        const response = await myFetch(wecomWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            msgtype: "markdown_v2",
            markdown_v2: { content },
          }),
        })
        console.log("[Briefing] WeCom digest sent, response:", response)
      } catch (error: any) {
        console.error("[Briefing] WeCom error:", error?.message || error)
      }
    }

    console.log("[Briefing] Daily briefing sent with digest:", digest.id)
  } finally {
    isBriefingRunning = false
  }
}

/**
 * Send test briefing with mock data
 */
export async function sendTestBriefing(): Promise<void> {
  const allItems: ScoredItem[] = [
    {
      id: "1",
      title: "OpenAI 发布 GPT-5，AGI 迎来里程碑突破",
      url: "https://openai.com",
      pubDate: Date.now() - 3600000,
      extra: { info: "华尔街见闻" },
      aiScore: 95,
      aiSummary: "GPT-5 在推理能力和多模态理解上实现质的飞跃，被视为通向 AGI 的关键一步",
      aiComment: "关注算力赛道",
      aiCategory: "AI动态",
    } as any,
    {
      id: "2",
      title: "英伟达 Q4 财报超预期，AI 芯片需求持续爆发",
      url: "https://nvidia.com",
      pubDate: Date.now() - 7200000,
      extra: { info: "金十数据" },
      aiScore: 88,
      aiSummary: "数据中心业务同比增长 400%，AI 芯片供不应求局面将持续至 2027 年",
      aiComment: "持续看好芯片股",
      aiCategory: "AI动态",
    } as any,
    {
      id: "3",
      title: "GPT-5 推理能力提升 300%，多模态理解达到新高度",
      url: "https://openai.com/gpt5",
      pubDate: Date.now() - 1800000,
      extra: { info: "科技日报" },
      aiScore: 85,
      aiSummary: "GPT-5 在复杂推理任务中表现卓越，图像和文本理解能力显著增强",
      aiComment: "技术突破值得期待",
      aiCategory: "AI动态",
    } as any,
    {
      id: "4",
      title: "美联储暗示最快 4 月降息，市场情绪转为乐观",
      url: "https://fed.gov",
      pubDate: Date.now() - 1800000,
      extra: { info: "财联社" },
      aiScore: 85,
      aiSummary: "通胀数据持续降温，鲍威尔释放鸽派信号，风险资产全线上涨",
      aiComment: "关注成长股机会",
      aiCategory: "财经市场",
    } as any,
    {
      id: "5",
      title: "中美科技战升级：半导体领域再加码管制",
      url: "https://reuters.com",
      pubDate: Date.now() - 10800000,
      extra: { info: "参考消息" },
      aiScore: 85,
      aiSummary: "美国拟对华实施更严格芯片出口限制，国产替代进程加速",
      aiComment: "关注国产替代",
      aiCategory: "全球视点",
    } as any,
    {
      id: "6",
      title: "欧洲通过 AI 监管法案，科技巨头面临合规压力",
      url: "https://eu.gov",
      pubDate: Date.now() - 14400000,
      extra: { info: "澎湃新闻" },
      aiScore: 82,
      aiSummary: "全球首个全面 AI 监管框架落地，对大模型训练数据提出更高透明度要求",
      aiComment: "合规成本上升",
      aiCategory: "全球视点",
    } as any,
  ]

  const date = new Date().toISOString().split("T")[0]

  console.log("[Test] Generated test briefing:", {
    date,
    total: allItems.length,
  })

  // Filter by score threshold (70)
  const filtered = filterByScore(allItems, DIGEST_SCORE_THRESHOLD)
  console.log(`[Test] Filtered by score >= ${DIGEST_SCORE_THRESHOLD}: ${filtered.length} items`)

  // Group by category
  const grouped = groupByCategory(filtered)
  console.log("[Test] Grouped by category:", {
    AI动态: grouped["AI动态"].length,
    财经市场: grouped["财经市场"].length,
    全球视点: grouped["全球视点"].length,
  })

  // Generate digest
  const digestInput: DigestInput = {
    aiDynamics: grouped["AI动态"],
    financeMarket: grouped["财经市场"],
    globalPerspectives: grouped["全球视点"],
    date,
  }

  const digest = await generateDigest(digestInput)
  const digestUrl = `${DIGEST_BASE_URL}/intel/digest/${digest.id}`

  console.log("[Test] Generated digest:", {
    id: digest.id,
    title: digest.title,
    summaryLength: digest.summary.length,
  })

  // Send to Feishu (card format)
  const feishuWebhook = getWebhookUrl("feishu")
  console.log("[Test] Feishu webhook:", feishuWebhook ? "configured" : "NOT configured", `(env: ${NODE_ENV})`)
  if (feishuWebhook) {
    const { myFetch } = await import("../utils/fetch")
    const card = buildFeishuDigestCard({
      title: digest.title,
      summary: digest.summary,
      date,
      digestUrl,
    })

    try {
      const response = await myFetch(feishuWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      })
      console.log("[Test] Feishu response:", response)
    } catch (error: any) {
      console.error("[Test] Feishu error:", error?.message || error)
    }
  } else {
    console.log("[Test] Feishu webhook not configured, skipping")
  }

  // Send to WeCom (markdown_v2 format)
  const wecomWebhook = getWebhookUrl("wecom")
  console.log("[Test] WeCom webhook:", wecomWebhook ? "configured" : "NOT configured", `(env: ${NODE_ENV})`)
  if (wecomWebhook) {
    const { myFetch } = await import("../utils/fetch")
    const content = buildWeComDigestContent({
      title: digest.title,
      summary: digest.summary,
      date,
      digestUrl,
    })

    console.log("[Test] WeCom digest content length:", content.length)

    try {
      const response = await myFetch(wecomWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msgtype: "markdown_v2",
          markdown_v2: { content },
        }),
      })
      console.log("[Test] WeCom digest response:", response)
    } catch (error: any) {
      console.error("[Test] WeCom digest error:", error?.message || error)
    }
  } else {
    console.log("[Test] WeCom webhook not configured, skipping")
  }

  console.log("[Test] Test briefing sent with digest:", digest.id)
}

/**
 * Start the scheduler (for local/Node.js deployment)
 * Uses simple interval checking
 */
let schedulerInterval: NodeJS.Timeout | null = null

export function startScheduler(): void {
  if (schedulerInterval) {
    return
  }

  console.log("[Scheduler] Starting daily briefing scheduler...")

  // Check every minute if it's time for briefing
  schedulerInterval = setInterval(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    const isBriefingTime = BRIEFING_TIMES.some(
      ([hour, minute]) => hour === currentHour && minute === currentMinute
    )

    if (isBriefingTime && !isBriefingRunning) {
      console.log("[Scheduler] Triggering daily briefing...")
      sendDailyBriefing().catch(console.error)
    }
  }, 60 * 1000)
}

export function stopScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval)
    schedulerInterval = null
    console.log("[Scheduler] Stopped")
  }
}
