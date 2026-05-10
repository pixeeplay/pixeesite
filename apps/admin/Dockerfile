# Pixeesite admin — Dockerfile
FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

COPY . .
RUN pnpm install --no-frozen-lockfile
RUN cd packages/database && pnpm db:platform:generate && pnpm db:tenant:generate
RUN pnpm --filter @pixeesite/admin build

ENV NODE_ENV=production
EXPOSE 3000

# Start: applique le schema platform DB (idempotent) puis démarre Next
CMD ["sh", "-c", "cd packages/database && pnpm db:platform:push --skip-generate --accept-data-loss && cd /app && pnpm --filter @pixeesite/admin start"]
