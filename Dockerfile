# ============ 运行阶段 ============
FROM node:20.12.2-alpine

# 安装运行时依赖
RUN apk add --no-cache \
    sqlite \
    dumb-init

WORKDIR /usr/app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs \
    && adduser -S newsnow -u 1001

# 设置权限
RUN mkdir -p .data && chown -R newsnow:nodejs /usr/app

# 复制本地构建的产物
COPY dist ./dist
COPY public ./public

# 复制 package.json 和安装生产依赖
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
COPY .npmrc.docker ./.npmrc

# 安装编译工具和重新编译 better-sqlite3
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && corepack enable \
    && pnpm install --frozen-lockfile --production --ignore-scripts \
    && pnpm rebuild better-sqlite3 \
    && cd /usr/app/dist/output/server \
    && npm rebuild better-sqlite3

# 环境变量
ENV HOST=0.0.0.0
ENV PORT=4444
ENV NODE_ENV=production

# 暴露端口
EXPOSE 4444

# 使用 dumb-init 作为 init 进程
USER newsnow

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "dist/output/server/index.mjs"]