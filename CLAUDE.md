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

1. **better-sqlite3 跨平台编译**:
   - 本地 macOS 构建的 `dist/output/server/node_modules/better-sqlite3` 二进制文件无法在 Linux 容器中运行
   - **解决方案**: 在 `Dockerfile.simplest` 中添加 `npm rebuild better-sqlite3` 重新编译：
     ```dockerfile
     && cd /usr/app/dist/output/server \
     && npm rebuild better-sqlite3
     ```

2. **oxc-parser 跨平台编译**: 在 `package.json` 的 `onlyBuiltDependencies` 中添加了 `"oxc-parser"`，确保 macOS 构建的镜像能在 Linux 容器中运行。

3. **Ollama 模型持久化**: 统一使用 `ollama_data` 卷名，避免重复下载模型。

3. **Docker 构建优化**:
   - 避免在容器内构建，使用本地构建的 `dist` 目录
   - 使用 `Dockerfile.simplest` 跳过复杂的构建步骤
   - 添加 `--ignore-scripts` 避免执行 `prepare` 脚本

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

#### Docker 部署优化
- 创建了 `Dockerfile.simplest` 使用本地构建产物
- 修复了 docker-compose.yml 中的 Ollama 配置
- 添加了 cleanup-docker.sh 脚本用于清理临时文件

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

### Docker 特殊说明
- Ollama 已集成在 docker-compose.yml 中，会自动加载 bge-m3 模型
- AI 情报管家功能完整可用（L1/L2/L3 过滤）
- 应用完全在 Docker 环境中运行，无需额外配置

#### 环境变量
- `FRESHNESS_WINDOW_MS` = 43200000`（12 小时）
- `INTEL_MIN_SCORE` = 85

#### WeCom 推送规则
1. 按分类分别推送（AI 动态、财经市场、全球视点）
2. 每个分类最多 5 条
3. 格式：markdown_v2
4. 不限制总长度，但避免单条消息超过 4096 字符

## Docker 部署指南

### 快速启动（推荐）

```bash
# 1. 环境准备
cp .env.docker.example .env
# 编辑 .env，至少设置 JWT_SECRET 和 DEEPSEEK_API_KEY

# 2. 本地构建
pnpm build

# 3. 启动所有服务（包括 Ollama 和 tunnel）
docker compose up -d --build
```

### Dockerfile 选择

项目包含多个 Dockerfile：
- `Dockerfile` - 完整构建（已弃用，oxc-parser 问题）
- `Dockerfile.simple` - 简化构建（未测试）
- `Dockerfile.simplest` - **推荐使用**，使用本地构建产物

### 关键配置

#### docker-compose.yml 正确配置：
- 使用 `Dockerfile.simplest`
- Ollama 服务简单配置：`command: serve`
- 健康检查：`test: ["CMD", "ollama", "list"]`
- 依赖关系：`condition: service_healthy`
- tunnel 服务已预配置

#### 环境变量：
```bash
# 必填
JWT_SECRET=至少32位随机密钥
DEEPSEEK_API_KEY=DeepSeek API密钥

# 可选
G_CLIENT_ID/SECRET - GitHub OAuth
FEISHU/WECOM_WEBHOOK - 通知推送
```

### 完整服务组成

1. **newsnow-ai** - 主应用（端口 4444）
2. **ollama** - AI 向量模型服务（端口 11434）
   - 自动加载 bge-m3 模型（1.2GB）
3. **tunnel** - Cloudflare Tunnel（需要先配置）

### 服务管理

```bash
# 查看所有服务状态
docker compose ps

# 查看应用日志
docker compose logs -f newsnow-ai

# 查看 Ollama 日志
docker compose logs -f ollama

# 重启服务
docker compose restart newsnow-ai
docker compose restart ollama

# 停止所有服务
docker compose down

# 清理临时文件
./cleanup-docker.sh
```

### 故障排除

1. **构建失败**：
   - 确保在本地运行 `pnpm build`
   - 使用 `Dockerfile.simplest`

2. **Ollama 问题**：
   - 确保模型已加载：`docker exec newsnow-ai-ollama ollama list`
   - 模型下载需要时间（约 1.2GB）

3. **服务启动顺序**：
   - Ollama 会先启动并加载模型
   - newsnow-ai 等待 Ollama 健康检查通过后启动

4. **端口占用**：
   - 确保端口 4444 和 11434 未被占用

### 有用的命令

```bash
# 检查 Ollama 模型状态
docker exec newsnow-ai-ollama ollama list

# 测试 Ollama API
curl http://localhost:11434/api/tags

# 查看实时日志
docker compose logs -f newsnow-ai
docker compose logs -f ollama

# 进入容器调试
docker exec -it newsnow-ai sh
docker exec -it newsnow-ai-ollama sh

# 备份数据
docker run --rm -v newsnow_ai_data:/data -v $(pwd):/backup alpine tar czf /backup/newsnow_db_backup.tar.gz -C /data .
```

## Recent Changes

### 2026-03-30 - Docker 部署成功修复

#### 修复内容：
- 成功配置了完整的 Docker 环境
- Ollama 服务正常运行并加载 bge-m3 模型
- 所有服务通过 docker-compose.yml 统一管理

#### 关键配置点：
1. **Dockerfile**: 使用 `Dockerfile.simplest`，基于本地构建产物
2. **Ollama 配置**:
   ```yaml
   command: serve
   healthcheck:
     test: ["CMD", "ollama", "list"]
   ```
3. **依赖管理**: 使用 `condition: service_healthy` 确保启动顺序
4. **环境变量**: OLLAMA_BASE_URL 默认指向容器内服务

#### 验证结果：
- ✅ 应用运行在 http://localhost:4444
- ✅ Ollama 运行在 11434 端口，bge-m3 模型已加载
- ✅ 所有服务健康检查通过
- ✅ AI 情报管家功能完整可用
