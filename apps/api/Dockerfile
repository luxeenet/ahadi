# Multi-stage Dockerfile for AHADI API (NestJS)
# Stage 1: base — Node.js + pnpm
# Stage 2: development — hot reload, dev dependencies
# Stage 3: builder — compile TypeScript
# Stage 4: production — minimal runtime image

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/worker/package.json ./apps/worker/
COPY packages/database/package.json ./packages/database/
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/types/package.json ./packages/types/
COPY packages/events/package.json ./packages/events/
RUN pnpm install --frozen-lockfile

# ── Stage 2: Development (with hot reload) ───────────────────────────────────
FROM deps AS development
COPY . .
RUN pnpm --filter @ahadi/database db:generate
EXPOSE 3000
CMD ["pnpm", "--filter", "@ahadi/api", "dev"]

# ── Stage 3: Build TypeScript ─────────────────────────────────────────────────
FROM deps AS builder
COPY . .
RUN pnpm --filter @ahadi/database db:generate
RUN pnpm --filter @ahadi/database build
RUN pnpm --filter @ahadi/config build
RUN pnpm --filter @ahadi/shared build
RUN pnpm --filter @ahadi/types build
RUN pnpm --filter @ahadi/api build

# ── Stage 4: Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS production
RUN apk add --no-cache libc6-compat openssl curl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies only
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/config/dist ./packages/config/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/types/dist ./packages/types/dist

COPY apps/api/package.json ./apps/api/

# Run as non-root user
USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health/live || exit 1

CMD ["node", "apps/api/dist/main"]
