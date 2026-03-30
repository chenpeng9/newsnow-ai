import { myFetch } from "./fetch"
import { fetchArticleContent } from "./article"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1"
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat"

export type AICategory = "AI动态" | "财经市场" | "全球视点"

interface LLMMessage {
  role: "system" | "user"
  content: string
}

interface LLMResponse {
  id: string
  choices: Array<{
    message: {
      content: string
    }
  }>
}

/**
 * Call DeepSeek API to score a news item
 */
export async function callLLM(
  messages: LLMMessage[]
): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY is not set")
  }

  const response = await myFetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: {
      model: DEEPSEEK_MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 1000,
    },
  })

  const data = response as LLMResponse

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No response from DeepSeek API")
  }

  return data.choices[0].message.content
}

/**
 * Generate AI score for a single news item
 * Fetches article content first, then scores using both title and content
 * Returns score (0-100), category, and cached article content
 */
export async function scoreWithAI(
  title: string,
  url: string,
  options: { fetchContent?: boolean } = {}
): Promise<{ score: number; category?: AICategory; articleContent?: string }> {
  const fetchContent = options.fetchContent !== false // default to true

  // Fetch article content for better scoring
  let articleContent = ""
  if (fetchContent) {
    try {
      articleContent = (await fetchArticleContent(url)) || ""
    } catch (error) {
      console.error("[LLM] Failed to fetch content:", error)
    }
  }

  const systemPrompt = `你是一位拥有深厚科技背景、宏观经济视野和敏锐投资嗅觉的"私人情报专家"。你的任务是为一名关注 AI 行业的爱好者、全球新闻观察者及业余投资者筛选海量新闻，并提供深度的价值评估。

评分标准（总分100分）：

1. AI 认知增长：
评估核心：是否涉及底层技术突破（Scaling Laws、模型架构）、产业链巨变（芯片、算力）或杀手级应用落地。
评分参考：
10-30分：公关稿、常规软件更新、噱头大于实质的新闻。
40-70分：重要财报数据、主流模型小版本迭代、行业标准制定。
80-100分：里程碑式突破（如 GPT-5 级别发布）、物理层/架构层颠覆、AGI 关键节点。

2. 市场温度感知：
评估核心：对二级市场、宏观经济政策（利率、就业、通胀）及行业板块轮动的直接驱动力。
评分参考：
10-30分：日常股价波动、无实质影响的分析师评论。
40-70分：宏观经济关键指标发布、大型并购传闻、行业资本流向显著变化。
80-100分：足以改变市场预期的政策转折点（如降息周期开启）、引发市场情绪剧烈变动的黑天鹅或灰犀牛事件。

3. 世界格局观测：
评估核心：是否影响地缘政治博弈、全球供应链安全、社会生产力结构或国家级 AI 战略。
评分参考：
10-30分：区域性政策微调、短期外交辞令。
40-70分：大国间的技术禁令、核心供应链转移、重大劳动力市场变革预警。
80-100分：改变全球格局的条约或冲突、主权 AI 竞争的质变、足以写入历史的政经节点。

分类标准：
- AI动态：涉及 AI 产业链、模型更新、芯片、算力、应用落地、AGI、大模型等
- 财经市场：涉及宏观经济、降息/加息、美联储、财报、股市、通胀、投资建议等
- 全球视点：涉及国际局势、地缘冲突、大国博弈、全球政策、国际关系等

返回格式要求：
请严格按照以下JSON格式返回，不要有任何额外文字：
{"score": 85, "category": "AI动态"}`

  // Build user prompt with or without content
  let userPrompt = `标题：${title}\n链接：${url}`
  if (articleContent) {
    userPrompt += `\n\n正文内容：\n${articleContent.slice(0, 3000)}` // Limit content to 3000 chars
  }
  userPrompt += "\n\n请给出评分和分类："

  try {
    const result = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ])

    // Parse JSON response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[LLM] Invalid JSON response:", result)
      return { score: 0, articleContent }
    }

    const parsed = JSON.parse(jsonMatch[0])
    const score = parseInt(String(parsed.score), 10)
    const category = parsed.category as AICategory | undefined

    if (Number.isNaN(score) || score < 0 || score > 100) {
      console.error("[LLM] Invalid score response:", result)
      return { score: 0, articleContent }
    }

    return { score, category, articleContent }
  } catch (error) {
    console.error("[LLM] Failed to score item:", error)
    return { score: 0, articleContent }
  }
}

/**
 * Batch score multiple items
 * Note: LLM doesn't have batch scoring, so we parallelize
 */
export async function batchScoreWithAI(
  items: Array<{ title: string; url: string }>,
  options: { fetchContent?: boolean } = {}
): Promise<Array<{ score: number; category?: AICategory; articleContent?: string }>> {
  const promises = items.map((item) =>
    scoreWithAI(item.title, item.url, options)
  )
  return Promise.all(promises)
}

/**
 * Generate digest for a single category
 * @param category Category name
 * @param items All items in this category (with cached article content)
 * @returns Digest content for this category (max 500 chars)
 */
export async function generateCategoryDigest(
  category: AICategory,
  items: Array<{
    title: string
    url: string
    aiScore: number
    articleContent?: string
    extra?: { info?: string }
  }>
): Promise<string> {
  // Build prompt with all items in this category
  const itemsText = items.map((item, index) => {
    const source = item.extra?.info || "未知来源"
    let text = `[${index + 1}] **${item.title}** (来源: ${source}, 分数: ${item.aiScore})\n`
    if (item.articleContent) {
      text += `内容: ${item.articleContent}\n`
    }
    return text
  }).join("\n")

  const systemPrompt = `你是一位专业的科技财经编辑。请根据以下新闻生成该分类的摘要。

要求：
1. 用 2-3 个段落总结该分类当天最重要的新闻，进行事实性归纳和串联
2. 使用事实陈述，避免主观评论
3. 提到具体的新闻事件时，标注来源序号 [1][2][3]
4. 总字数控制在 500 字内
5. 使用 Markdown 格式输出`

  const userPrompt = `分类: ${category}\n\n新闻列表:\n${itemsText}\n\n请生成该分类的摘要：`

  try {
    const result = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ])

    return result.trim()
  } catch (error) {
    console.error(`[LLM] Failed to generate category digest for ${category}:`, error)
    throw error
  }
}

/**
 * Generate push summary from digest content
 * @param digestContent Full digest content
 * @returns Push summary (300-500 chars)
 */
export async function generatePushSummary(
  digestContent: string
): Promise<string> {
  const systemPrompt = `你是一位专业的科技财经编辑。请根据以下汇总文章生成一段推送摘要。

要求：
1. 对整篇文章进行高度概括，不要按分类分别描述
2. 突出当天最重要的 2-3 条核心新闻
3. 语言简洁，适合快速阅读
4. 总字数控制在 300-500 字
5. 使用 Markdown 格式输出`

  const userPrompt = `汇总文章:\n${digestContent}\n\n请生成推送摘要：`

  try {
    const result = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ])

    return result.trim()
  } catch (error) {
    console.error("[LLM] Failed to generate push summary:", error)
    throw error
  }
}
