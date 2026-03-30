![](/public/og-image.png)

English | [简体中文](README.zh-CN.md) | [日本語](README.ja-JP.md)

> **Note**: This project is based on the excellent [NewsNow](https://github.com/ourongxing/newsnow) by ourongxing. We've added significant AI-powered features and continue to evolve it. Thank you for the great foundation!

> [!NOTE]
> This is a demo version currently supporting Chinese only. A full-featured version with better customization and English content support will be released later.

**_Elegant reading of real-time and hottest news_**

## Features

### Core Features
- Clean and elegant UI design for optimal reading experience
- Real-time updates on trending news
- GitHub OAuth login with data synchronization
- 30-minute default cache duration (logged-in users can force refresh)
- Adaptive scraping interval (minimum 2 minutes) based on source update frequency to optimize resource usage and prevent IP bans

### AI Intelligence Hub 🤖
- **Three-Layer Smart Filtering**:
  - L1 Heuristic Filter: Remove low-quality content (ads, promotions, duplicates)
  - L2 Semantic Deduplication: Use Ollama (bge-m3) for semantic similarity analysis
  - L3 AI Scoring: Score news (0-100) using DeepSeek API
- **Daily Briefing**: Automatically generate and send high-quality news summaries at 08:30 daily
- **Multi-Channel Push**: Support Feishu and WeCom notifications
- **Source Classification**: Four categories (A/B/C/D) based on quality and update frequency

### Deployment Options
- **Docker One-Click Deployment**: Built-in Ollama vector database, ready to use
- **Cloudflare Pages**: With D1 database support
- **Vercel/Bun**: Multiple deployment choices

## Deployment

### Basic Deployment

For deployments without login and caching:

1. Fork this repository
2. Import to platforms like Cloudflare Page or Vercel

### Cloudflare Page Configuration

- Build command: `pnpm run build`
- Output directory: `dist/output/public`

### GitHub OAuth Setup

1. [Create a GitHub App](https://github.com/settings/applications/new)
2. No special permissions required
3. Set callback URL to: `https://your-domain.com/api/oauth/github` (replace `your-domain` with your actual domain)
4. Obtain Client ID and Client Secret

### Environment Variables

Refer to `example.env.server`. For local development, rename it to `.env.server` and configure:

```env
# Github Client ID
G_CLIENT_ID=
# Github Client Secret
G_CLIENT_SECRET=
# JWT Secret, usually the same as Client Secret
JWT_SECRET=
# Initialize database, must be set to true on first run, can be turned off afterward
INIT_TABLE=true
# Whether to enable cache
ENABLE_CACHE=true
```

### Database Support

Supported database connectors: https://db0.unjs.io/connectors
**Cloudflare D1 Database** is recommended.

1. Create D1 database in Cloudflare Worker dashboard
2. Configure database_id and database_name in wrangler.toml
3. If wrangler.toml doesn't exist, rename example.wrangler.toml and modify configurations
4. Changes will take effect on next deployment

### Docker Deployment

In project root directory:

```sh
docker compose up
```

You can also set Environment Variables in `docker-compose.yml`.

## Development

> [!Note]
> Requires Node.js >= 20

```sh
corepack enable
pnpm i
pnpm dev
```

### Adding Data Sources

Refer to `shared/sources` and `server/sources` directories. The project provides complete type definitions and a clean architecture.

For detailed instructions on how to add new sources, see [CONTRIBUTING.md](CONTRIBUTING.md).

**_release when ready_**
![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20250328172146_rec_.gif?x-oss-process=base_webp)

## Contributing

Contributions are welcome! Feel free to submit pull requests or create issues for feature requests and bug reports.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute, especially for adding new data sources.

## License

[MIT](./LICENSE) © eiden
