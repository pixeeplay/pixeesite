# Pixeesite render — Dockerfile single-stage
FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /app

COPY . .
RUN pnpm install --no-frozen-lockfile
RUN cd packages/database && pnpm db:platform:generate && pnpm db:tenant:generate
RUN pnpm --filter @pixeesite/render build

ENV NODE_ENV=production
EXPOSE 3001
CMD ["pnpm", "--filter", "@pixeesite/render", "start"]
