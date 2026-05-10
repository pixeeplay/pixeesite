# Pixeesite render app — multi-stage Dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/admin/package.json ./apps/admin/
COPY apps/render/package.json ./apps/render/
COPY apps/cli/package.json ./apps/cli/
COPY packages/database/package.json ./packages/database/
COPY packages/blocks/package.json ./packages/blocks/
COPY packages/ai/package.json ./packages/ai/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --no-frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/render/node_modules ./apps/render/node_modules
COPY --from=deps /app/packages ./packages
COPY . .
WORKDIR /app/packages/database
RUN pnpm db:platform:generate && pnpm db:tenant:generate
WORKDIR /app
RUN pnpm --filter @pixeesite/render build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/render ./apps/render
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
EXPOSE 3001
CMD ["pnpm", "--filter", "@pixeesite/render", "start"]
