import { myFetch } from "./fetch"
import { fetchArticleContent } from "./article"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1"
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat"

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
 * Generate AI score and summary for a single news item
 * Fetches article content first, then scores using both title and content
 * Returns score (0-100), summary (100 chars), comment (20 chars), and category
 */
export async function scoreWithAI(
  title: string,
  url: string,
  options: { fetchContent?: boolean } = {}
): Promise<{ score: number; summary: string; comment: string; category?: "AI动态" | "财经市场" | "全球视点" }> {
  const fetchContent = options.fetchContent !== false // default to true

  // Fetch article content for better scoring
  let content = ""
  if (fetchContent) {
    try {
      content = (await fetchArticleContent(url)) || ""
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
{"score": 85, "summary": "150字左右的摘要，说明这条信息的核心价值和意义", "comment": "30字以内的简短点评或行动建议", "category": "AI动态"}`

  // Build user prompt with or without content
  let userPrompt = `标题：${title}\n链接：${url}`
  if (content) {
    userPrompt += `\n\n正文内容：\n${content.slice(0, 3000)}` // Limit content to 3000 chars
  }
  userPrompt += "\n\n请给出评分、摘要和点评："

  try {
    const result = await callLLM([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ])

    // Parse JSON response
    const jsonMatch = result.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[LLM] Invalid JSON response:", result)
      return { score: 0, summary: "无法生成摘要", comment: "无点评" }
    }

    const parsed = JSON.parse(jsonMatch[0])
    const score = parseInt(String(parsed.score), 10)
    const summary = (parsed.summary || "").slice(0, 200)
    const comment = (parsed.comment || "").slice(0, 30)
    const category = parsed.category as "AI动态" | "财经市场" | "全球视点" | undefined

    if (Number.isNaN(score) || score < 0 || score > 100) {
      console.error("[LLM] Invalid score response:", result)
      return { score: 0, summary: "无法生成摘要", comment: "无点评" }
    }

    return { score, summary, comment, category }
  } catch (error) {
    console.error("[LLM] Failed to score item:", error)
    return { score: 0, summary: "无法生成摘要", comment: "无点评" }
  }
}

/**
 * Batch score multiple items
 * Note: LLM doesn't have batch scoring, so we parallelize
 */
export async function batchScoreWithAI(
  items: Array<{ title: string; url: string }>,
  options: { fetchContent?: boolean } = {}
): Promise<Array<{ score: number; summary: string; comment: string }>> {
  const promises = items.map((item) =>
    scoreWithAI(item.title, item.url, options)
  )
  return Promise.all(promises)
}
