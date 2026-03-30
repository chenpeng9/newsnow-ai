import type { Database } from "db0"
import type { ScoredItem, AICategory } from "../intel/filter"

interface PushedNewsRow {
  url: string
  title: string
  pushed_at: number
  score: number
  source: string
  ai_category?: AICategory
  article_content?: string
  digest_id?: string
  // Keep old fields for backward compatibility with existing data
  ai_summary?: string
  ai_comment?: string
}

export interface DigestRow {
  id: string
  date: string
  title: string
  content: string
  summary: string
  categories: string // JSON string
  flash_news: string // JSON string
  created_at: number
}

export interface DateGroup {
  date: string
  count: number
  items: ScoredItem[]
  stats: {
    total: number
    sourceCount: number
  }
}

export interface Digest {
  id: string
  date: string
  title: string
  content: string
  summary: string
  categories: {
    AI动态?: ScoredItem[]
    财经市场?: ScoredItem[]
    全球视点?: ScoredItem[]
  }
  createdAt: number
}

export interface GroupByDateOptions {
  limit?: number
  offset?: number
  category?: string
  startDate?: string
  endDate?: string
}

export class PushedNews {
  private db

  constructor(db: Database) {
    this.db = db
  }

  async init() {
    // Check if old table exists with wrong schema (id column instead of url)
    try {
      await this.db.prepare(`SELECT id FROM pushed_news LIMIT 1`).all()
      // If we get here, old table exists with 'id' column - drop it
      await this.db.prepare(`DROP TABLE pushed_news`).run()
      logger.info(`Dropped old pushed_news table (migrating to url-based)`)
    } catch {
      // Table doesn't exist or already has correct schema, that's fine
    }

    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS pushed_news (
        url TEXT PRIMARY KEY,
        title TEXT,
        pushed_at INTEGER,
        score INTEGER,
        source TEXT,
        ai_summary TEXT,
        ai_comment TEXT,
        ai_category TEXT,
        digest_id TEXT
      );
    `).run()

    // Migration: Add new columns if they don't exist
    const columns = await this.db.prepare(`PRAGMA table_info(pushed_news)`).all() as any
    const columnNames = new Set((columns.results ?? columns).map((c: any) => c.name))

    if (!columnNames.has('ai_summary')) {
      await this.db.prepare(`ALTER TABLE pushed_news ADD COLUMN ai_summary TEXT`).run()
      logger.info(`Added ai_summary column to pushed_news table`)
    }
    if (!columnNames.has('ai_comment')) {
      await this.db.prepare(`ALTER TABLE pushed_news ADD COLUMN ai_comment TEXT`).run()
      logger.info(`Added ai_comment column to pushed_news table`)
    }
    if (!columnNames.has('ai_category')) {
      await this.db.prepare(`ALTER TABLE pushed_news ADD COLUMN ai_category TEXT`).run()
      logger.info(`Added ai_category column to pushed_news table`)
    }
    if (!columnNames.has('digest_id')) {
      await this.db.prepare(`ALTER TABLE pushed_news ADD COLUMN digest_id TEXT`).run()
      logger.info(`Added digest_id column to pushed_news table`)
    }
    if (!columnNames.has('article_content')) {
      await this.db.prepare(`ALTER TABLE pushed_news ADD COLUMN article_content TEXT`).run()
      logger.info(`Added article_content column to pushed_news table`)
    }

    // Create digests table
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS digests (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT,
        content TEXT,
        summary TEXT,
        categories TEXT,
        flash_news TEXT,
        created_at INTEGER
      );
    `).run()

    logger.success(`init pushed_news and digests tables`)
  }

  /**
   * Mark a news item as pushed (using URL as unique identifier)
   */
  async markAsPushed(item: ScoredItem) {
    const now = Date.now()
    const url = (item as any).url
    if (!url) return

    const source = (item as any).extra?.info || ""
    const aiCategory = item.aiCategory || ""
    const articleContent = item.articleContent || ""

    await this.db.prepare(
      `INSERT OR REPLACE INTO pushed_news (url, title, pushed_at, score, source, ai_category, article_content) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(url, (item as any).title || "", now, item.aiScore || 0, source, aiCategory, articleContent)
  }

  /**
   * Mark multiple news items as pushed
   */
  async markBatchAsPushed(items: ScoredItem[]) {
    for (const item of items) {
      await this.markAsPushed(item)
    }
  }

  /**
   * Get URLs that have already been pushed
   * Returns a Set of pushed URLs
   */
  async getPushedUrls(urls: string[]): Promise<Set<string>> {
    if (urls.length === 0) return new Set()

    const placeholders = urls.map(() => "?").join(",")
    const rows = await this.db.prepare(
      `SELECT url FROM pushed_news WHERE url IN (${placeholders})`
    ).all(...urls) as any

    const results = rows.results ?? rows
    const pushedUrls = new Set<string>()

    for (const row of results as PushedNewsRow[]) {
      pushedUrls.add(row.url)
    }

    return pushedUrls
  }

  /**
   * Clean old records (older than specified days)
   */
  async cleanOldRecords(days: number = 7) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
    const result = await this.db.prepare(
      `DELETE FROM pushed_news WHERE pushed_at < ?`
    ).run(cutoff)

    logger.info(`Cleaned old pushed_news records (older than ${days} days)`)
    return result
  }

  /**
   * Get recent pushed news count
   */
  async getRecentCount(hours: number = 24): Promise<number> {
    const cutoff = Date.now() - hours * 60 * 60 * 1000
    const row = await this.db.prepare(
      `SELECT COUNT(*) as count FROM pushed_news WHERE pushed_at > ?`
    ).get(cutoff) as any

    return row?.count || 0
  }

  /**
   * Get pushed news grouped by date
   */
  async getGroupedByDate(options: GroupByDateOptions = {}): Promise<DateGroup[]> {
    const { limit = 10, offset = 0, category, startDate, endDate } = options

    // Build WHERE conditions
    const conditions: string[] = []
    const params: any[] = []

    if (category) {
      conditions.push(`ai_category = ?`)
      params.push(category)
    }

    if (startDate) {
      const startTimestamp = new Date(startDate).setHours(0, 0, 0, 0)
      conditions.push(`pushed_at >= ?`)
      params.push(startTimestamp)
    }

    if (endDate) {
      const endTimestamp = new Date(endDate).setHours(23, 59, 59, 999)
      conditions.push(`pushed_at <= ?`)
      params.push(endTimestamp)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Get distinct dates
    const dateRows = await this.db.prepare(
      `SELECT DISTINCT date(pushed_at / 1000, 'unixepoch') as date
       FROM pushed_news
       ${whereClause}
       ORDER BY date DESC
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset) as any

    const results = dateRows.results ?? dateRows
    const groups: DateGroup[] = []

    for (const row of results) {
      const date = row.date
      if (!date) continue

      // Get items for this date
      const startOfDay = new Date(date).setHours(0, 0, 0, 0)
      const endOfDay = new Date(date).setHours(23, 59, 59, 999)

      let itemsQuery = `SELECT * FROM pushed_news WHERE pushed_at >= ? AND pushed_at <= ?`
      const itemsParams: any[] = [startOfDay, endOfDay]

      if (category) {
        itemsQuery += ` AND ai_category = ?`
        itemsParams.push(category)
      }

      itemsQuery += ` ORDER BY score DESC LIMIT 3`

      const itemsRows = await this.db.prepare(itemsQuery).all(...itemsParams) as any
      const items = (itemsRows.results ?? itemsRows) as PushedNewsRow[]

      // Get stats for this date
      let statsQuery = `SELECT COUNT(*) as total, COUNT(DISTINCT source) as sourceCount FROM pushed_news WHERE pushed_at >= ? AND pushed_at <= ?`
      const statsParams: any[] = [startOfDay, endOfDay]

      if (category) {
        statsQuery += ` AND ai_category = ?`
        statsParams.push(category)
      }

      const statsRow = await this.db.prepare(statsQuery).get(...statsParams) as any

      groups.push({
        date,
        count: statsRow?.total || 0,
        items: items.map(this.rowToScoredItem),
        stats: {
          total: statsRow?.total || 0,
          sourceCount: statsRow?.sourceCount || 0,
        },
      })
    }

    return groups
  }

  /**
   * Get all items for a specific date
   */
  async getByDate(date: string): Promise<ScoredItem[]> {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0)
    const endOfDay = new Date(date).setHours(23, 59, 59, 999)

    const rows = await this.db.prepare(
      `SELECT * FROM pushed_news WHERE pushed_at >= ? AND pushed_at <= ? ORDER BY score DESC`
    ).all(startOfDay, endOfDay) as any

    const results = rows.results ?? rows
    return (results as PushedNewsRow[]).map(this.rowToScoredItem)
  }

  /**
   * Get stats for a specific date (or all dates if not specified)
   */
  async getStats(date?: string): Promise<{ total: number; sourceCount: number }> {
    if (date) {
      const startOfDay = new Date(date).setHours(0, 0, 0, 0)
      const endOfDay = new Date(date).setHours(23, 59, 59, 999)

      const row = await this.db.prepare(
        `SELECT COUNT(*) as total, COUNT(DISTINCT source) as sourceCount FROM pushed_news WHERE pushed_at >= ? AND pushed_at <= ?`
      ).get(startOfDay, endOfDay) as any

      return {
        total: row?.total || 0,
        sourceCount: row?.sourceCount || 0,
      }
    }

    const row = await this.db.prepare(
      `SELECT COUNT(*) as total, COUNT(DISTINCT source) as sourceCount FROM pushed_news`
    ).get() as any

    return {
      total: row?.total || 0,
      sourceCount: row?.sourceCount || 0,
    }
  }

  /**
   * Convert database row to ScoredItem
   */
  private rowToScoredItem(row: PushedNewsRow): ScoredItem {
    return {
      id: row.url,
      url: row.url,
      title: row.title,
      pubDate: row.pushed_at,
      extra: {
        info: row.source,
        date: row.pushed_at,
      },
      aiScore: row.score,
      aiCategory: row.ai_category,
      articleContent: row.article_content,
    } as ScoredItem
  }

  /**
   * Save a digest
   */
  async saveDigest(digest: Omit<Digest, 'createdAt'>): Promise<void> {
    const now = Date.now()
    await this.db.prepare(
      `INSERT OR REPLACE INTO digests (id, date, title, content, summary, categories, flash_news, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      digest.id,
      digest.date,
      digest.title,
      digest.content,
      digest.summary,
      JSON.stringify(digest.categories),
      '{}', // flash_news is deprecated, store empty object
      now
    )
    logger.info(`Saved digest ${digest.id} for date ${digest.date}`)
  }

  /**
   * Get a digest by ID
   */
  async getDigestById(id: string): Promise<Digest | null> {
    const row = await this.db.prepare(`SELECT * FROM digests WHERE id = ?`).get(id) as any
    if (!row) return null

    return {
      id: row.id,
      date: row.date,
      title: row.title,
      content: row.content,
      summary: row.summary,
      categories: JSON.parse(row.categories || '{}'),
      createdAt: row.created_at,
    }
  }

  /**
   * Get digests by date
   */
  async getDigestsByDate(date: string): Promise<Digest[]> {
    const rows = await this.db.prepare(`SELECT * FROM digests WHERE date = ? ORDER BY created_at DESC`).all(date) as any
    const results = rows.results ?? rows

    return results.map((row: DigestRow) => ({
      id: row.id,
      date: row.date,
      title: row.title,
      content: row.content,
      summary: row.summary,
      categories: JSON.parse(row.categories || '{}'),
      createdAt: row.created_at,
    }))
  }

  /**
   * Get recent digests
   */
  async getRecentDigests(limit: number = 10, offset: number = 0): Promise<Digest[]> {
    const rows = await this.db.prepare(`SELECT * FROM digests ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset) as any
    const results = rows.results ?? rows

    return results.map((row: DigestRow) => ({
      id: row.id,
      date: row.date,
      title: row.title,
      content: row.content,
      summary: row.summary,
      categories: JSON.parse(row.categories || '{}'),
      createdAt: row.created_at,
    }))
  }

  /**
   * Mark news items with digest_id
   */
  async markWithDigest(items: ScoredItem[], digestId: string): Promise<void> {
    for (const item of items) {
      const url = (item as any).url
      if (!url) continue

      await this.db.prepare(`UPDATE pushed_news SET digest_id = ? WHERE url = ?`).run(digestId, url)
    }
    logger.info(`Marked ${items.length} items with digest_id ${digestId}`)
  }
}

let pushedNewsInstance: PushedNews | undefined

export async function getPushedNewsTable() {
  if (pushedNewsInstance) return pushedNewsInstance

  try {
    const db = useDatabase()
    pushedNewsInstance = new PushedNews(db)
    await pushedNewsInstance.init()
    return pushedNewsInstance
  } catch (e) {
    logger.error("failed to init pushed_news table ", e)
  }
}