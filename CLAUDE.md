# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NewsNow-AI is a news aggregator web app that collects trending news from multiple Chinese sources. It features a clean UI with real-time updates, GitHub OAuth login, and data synchronization.

## Tech Stack

- **Frontend**: React 19 + TanStack Router + TanStack Query + Jotai
- **Backend**: Nitro (node-server, deployable to Vercel, Cloudflare Pages, Bun)
- **Database**: SQLite (better-sqlite3 dev, Cloudflare D1 for production)
- **Build**: Vite 6.x + pnpm
- **Styling**: UnoCSS

## Important Notes

- **Vite Version**: Use Vite 6.x only. Vite 7 has compatibility issues with `vite-plugin-with-nitro` causing runtime errors.
- **h3 Override**: Add h3 version override in `package.json`:
  ```json
  "pnpm": {
    "overrides": {
      "h3": "1.15.3"
    }
  }
  ```

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm test         # Run tests with Vitest
pnpm typecheck    # Run TypeScript type checking
pnpm presource    # Regenerate sources.json after adding/modifying sources
pnpm preview      # Preview production build (Cloudflare Pages)
pnpm deploy       # Deploy to Cloudflare Pages
```

## Architecture

```
src/              # Frontend React code (routes, components, hooks, atoms)
server/           # Nitro server API
  ├── api/        # API endpoints (login, oauth, sync, sources, intel)
  ├── sources/    # News source fetchers (one file per source)
  ├── intel/     # Intel filtering (L1/L2/L3 filters)
  ├── database/   # Database operations (cache, user)
  └── utils/      # Utility functions (fetch, date, crypto, scheduler, notify, llm, ollama)
shared/           # Shared types and source configuration
  ├── pre-sources.ts    # Source definitions (name, color, interval, subs)
  ├── sources.json      # Generated from pre-sources.ts
  └── intel-categories.ts # Intel source categories (A/B/C/D)
```

## Adding New Sources

1. **Register source** in `shared/pre-sources.ts`:
   ```typescript
   "sourceid": {
     name: "Source Name",
     color: "blue",
     home: "https://example.com",
     sub: {
       "subsection": { title: "Subsection Title", column: "tech" }
     }
   }
   ```

2. **Implement fetcher** in `server/sources/sourceid.ts`:
   ```typescript
   import * as cheerio from "cheerio"

   export default defineSource(async () => {
     const html = await myFetch(url, { headers: {...} })
     const $ = cheerio.load(html)

     return $("selector").map((_, el) => ({
       id: "unique-id",
       title: $(el).find("title").text(),
       url: $(el).find("a").attr("href"),
       extra: { info: "additional info" }
     })).get()
   })
   ```

3. **Run** `pnpm presource` to regenerate `sources.json`

The `defineSource` helper and `myFetch` are globally available in source files. Return `NewsItem[]` with `id`, `title`, `url`, and optional `extra`.

## Environment Variables

Create `.env.server` from `example.env.server`:
- `G_CLIENT_ID` / `G_CLIENT_SECRET` - GitHub OAuth
- `JWT_SECRET` - Session secret
- `INIT_TABLE` - Set to `true` on first run
- `ENABLE_CACHE` - Cache news (default: true)
- `PRODUCTHUNT_API_TOKEN` - Optional, for Product Hunt source

## Database

Uses db0 with database connectors. For production on Cloudflare Pages, use Cloudflare D1:
1. Create D1 database in Cloudflare dashboard
2. Configure `database_id` and `database_name` in `wrangler.toml`

## AI 情报管家 (Intel)

AI-powered news filtering and daily briefing system with three-layer filtering.

### Intel Categories

News sources are categorized by quality and processing frequency (see `shared/intel-categories.ts`):

- **A 类** (深度/专业级): jin10, wallstreetcn-hot, cls-depth, fastbull-express
- **B 类** (宏观/全球视野): cls-hot, 36kr-quick, cankaoxiaoxi, sputniknewscn, ifeng, thepaper, wallstreetcn-quick
- **C 类** (实时热度/情绪): baidu, weibo, zhihu, 36kr-renqi
- **D 类** (科技社区/生产力): ithome, sspai, juejin, solidot

### Three-Layer Filtering

1. **L1 启发式过滤**: Remove low-quality content (ads, promotions, duplicates)
2. **L2 语义去重**: Use Ollama (bge-m3) for semantic similarity, keep first in each cluster
3. **L3 AI 评分**: Use DeepSeek API to score news (0-100), generate 100-char summary + 20-char comment

### API Endpoints

```bash
POST /api/intel/scan          # Run full intel scan (L1→L2→L3)
POST /api/intel/briefing      # Generate and send daily briefing
POST /api/intel/test-briefing # Send test briefing with mock data
```

### Daily Briefing

Runs at 08:30 daily, scans A category sources only. Sends Feishu card format with:
- Title with date
- Each news item: title, score, source, summary, comment, primary button link
- HR separator between items

### Environment Variables

Additional Intel-related variables in `.env.server`:
- `DEEPSEEK_API_KEY` - DeepSeek API key for L3 scoring and digest generation (required)
- `DEEPSEEK_BASE_URL` - DeepSeek API base URL (default: https://api.deepseek.com/v1)
- `DEEPSEEK_MODEL` - DeepSeek model name (default: deepseek-chat)
- `OLLAMA_BASE_URL` - Ollama server URL for L2 semantic deduplication (default: http://localhost:11434)
- `FEISHU_WEBHOOK` - Feishu webhook URL for daily briefing notifications
- `WECOM_WEBHOOK` - WeCom webhook URL for daily briefing notifications
- `FEISHU_TEST_WEBHOOK` - Feishu test webhook URL (used only for `/api/intel/test-briefing`)
- `WECOM_TEST_WEBHOOK` - WeCom test webhook URL (used only for `/api/intel/test-briefing`)
- `DIGEST_BASE_URL` - Base URL for digest article links (default: http://localhost:4444)
- `INTEL_MIN_SCORE` - Minimum score threshold for digest generation (default: 70)

### Testing

Test the digest generation with mock data:

```bash
# Send test briefing (uses TEST_WEBHOOK if configured, otherwise PRODUCTION)
curl -X POST http://localhost:4444/api/intel/test-briefing

# Send real briefing (fetches actual news)
curl -X POST http://localhost:4444/api/intel/briefing
```
## Docker Deployment

Docker 用于生产环境部署，开发时直接使用本地 pnpm。

### Commands

```bash
# 开发模式（推荐）
pnpm dev

# 生产模式（Docker）
docker compose up -d --build
docker compose logs -f        # 查看日志
docker compose down           # 停止服务
```

### Configuration

- `docker-compose.yml` - Docker 编排配置
- `Dockerfile` - 多阶段构建

### Data Volumes

- `newsnow_ai_data` - 应用数据库
- `ollama_data` - Ollama 模型（bge-m3，~1.2GB）

### Environment Variables

通过 `.env` 文件配置，主要变量：

```
JWT_SECRET=
DEEPSEEK_API_KEY=
FEISHU_WEBHOOK=
WECOM_WEBHOOK=
```

### Known Issues

1. **oxc-parser 跨平台编译**: 在 `package.json` 的 `onlyBuiltDependencies` 中添加了 `"oxc-parser"`，确保 macOS 构建的镜像能在 Linux 容器中运行。

2. **Ollama 模型持久化**: 统一使用 `ollama_data` 卷名，避免重复下载模型。

## Recent Changes

### 2026-03-14

#### 新增功能：WeCom 推送优化

**1. 新闻新鲜度过滤**
- 在 `generateDailyBriefing` 中添加 12 小时时间窗口过滤
- 只推送最近 12 小时内采集 + AI 评分的新闻
- 避免推送过旧的新闻

**2. 推送数量限制调整**
- WeCom：每个分类最多推送 5 条新闻
- 飞书：不限制数量

**3. 总结信息优化**
- 显示采集的渠道数量
- 显示采集的文章总数
- 显示每类实际推送数量
- 格式更精简

#### 文件修改
- `server/utils/scheduler.ts`：
  - 添加 `FRESHNESS_WINDOW_MS = 12 * 60 * 60 * 1000` 鸸量
  - `generateDailyBriefing`：添加新鲜度过滤，使用 `currentTime` 替代 `now` 避免变量冲突
  - 移除 WeCom 推送的 `.slice(0, 5)` 限制

#### 总结格式示例
``
📰 本次新闻来自5个渠道，160条信息，过滤推送：
AI动态: 5条
财经市场: 2条
全球视点: 5条

由 早8晚8💰 Ai推送
``

#### API 端点
- `POST /api/intel/scan` - 完整的 intel 扫描（L1→L2→L3）
- `POST /api/intel/briefing` - 生成并发送每日简报
- `POST /api/intel/test-briefing` - 发送测试简报

#### 环境变量
- `FRESHNESS_WINDOW_MS` = 43200000`（12 小时）
- `INTEL_MIN_SCORE` = 85

#### WeCom 推送规则
1. 按分类分别推送（AI 动态、财经市场、全球视点）
2. 每个分类最多 5 条
3. 格式：markdown_v2
4. 不限制总长度，但避免单条消息超过 4096 字符
