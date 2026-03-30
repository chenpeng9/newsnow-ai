# ============ 构建阶段 ============
FROM node:20.12.2 AS builder

WORKDIR /usr/src

# 安装构建工具
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# 启用 pnpm
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

# 复制依赖配置文件和 patches
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
COPY .npmrc.docker ./.npmrc

# 安装依赖（强制为 Linux ARM64 平台安装原生模块）
RUN pnpm install --frozen-lockfile

# 手动安装 oxc-parser 的 Linux ARM64 绑定
RUN pnpm add -D @oxc-parser/binding-linux-arm64-gnu@0.115.0 || \
    (npm install --save-optional @oxc-parser/binding-linux-arm64-gnu@0.115.0 && \
    pnpm install --frozen-lockfile)

# 复制源码
COPY . .

# 构建项目（生成 sources.json + Vite 构建）
RUN pnpm run build

# ============ 运行阶段 ============
FROM node:20.12.2-slim

WORKDIR /usr/app

# 安装运行时依赖
RUN apt-get update && apt-get install -y \
    libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

# 复制构建产物
COPY --from=builder /usr/src/dist/output ./output
COPY --from=builder /usr/src/node_modules ./node_modules

# 处理符号链接：复制 public 目录到运行位置
COPY --from=builder /usr/src/public ./output/server/chunks/public

# 创建数据目录
RUN mkdir -p .data

# 环境变量（通过 docker-compose 覆盖）
ENV HOST=0.0.0.0
ENV PORT=4444
ENV NODE_ENV=production

EXPOSE 4444

CMD ["node", "output/server/index.mjs"]
