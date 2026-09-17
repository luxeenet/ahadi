# AHADI — Universal Commitment & Trust Network

> **Infrastructure for verifiable commitments.**

AHADI is a production-grade platform that enables individuals, professionals, businesses, and groups to create, manage, verify, and analyze commitments — building permanent, auditable trust histories.

---

## Architecture

- **Type**: Modular Monolith → Event-Driven
- **API**: NestJS + Fastify (TypeScript, strict mode)
- **Database**: PostgreSQL 16 + Prisma ORM
- **Queue**: BullMQ on Redis 7
- **Storage**: S3-compatible (MinIO in dev)
- **Events**: Transactional Outbox Pattern
- **Auth**: JWT (15m) + Opaque Refresh Tokens (30d)

## Project Structure

```
ahadi/
├── apps/
│   ├── api/       # NestJS REST API
│   └── worker/    # BullMQ background workers
├── packages/
│   ├── database/  # Prisma schema + client
│   ├── config/    # Validated environment config
│   ├── shared/    # Errors, utilities, constants
│   ├── types/     # Shared TypeScript types
│   └── events/    # Domain event definitions
├── infrastructure/
│   └── docker/
├── docs/
├── scripts/
└── docker-compose.yml
```

## Quick Start (Development)

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### 1. Clone and install
```bash
git clone https://github.com/your-org/ahadi.git
cd ahadi
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure
```bash
pnpm docker:up
# PostgreSQL: localhost:5432
# Redis:      localhost:6379
# MinIO:      localhost:9000 (console: localhost:9001)
# Mailhog:    localhost:8025
```

### 4. Run database migrations
```bash
pnpm db:migrate
pnpm db:seed        # optional: load development seed data
```

### 5. Start the API
```bash
pnpm dev            # API on http://localhost:3000
pnpm dev:worker     # Worker process
# Or both:
pnpm dev:all
```

### 6. Open Swagger docs
```
http://localhost:3000/api/docs
```

## Development Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start API with hot reload |
| `pnpm dev:worker` | Start worker process |
| `pnpm test:unit` | Run unit tests |
| `pnpm test:integration` | Run integration tests |
| `pnpm test:e2e` | Run E2E journey tests |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm docker:up` | Start all services |
| `pnpm docker:down` | Stop all services |
| `pnpm docker:reset` | Reset all data |

## API

Base URL: `http://localhost:3000/api/v1`

All responses use the standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "meta": { "requestId": "...", "timestamp": "..." }
}
```

Errors:
```json
{
  "success": false,
  "error": {
    "code": "COMMITMENT_ALREADY_ACCEPTED",
    "message": "...",
    "requestId": "..."
  }
}
```

## Security

- JWT access tokens: 15-minute expiry
- Opaque refresh tokens: stored server-side, revocable
- OTP verification for phone/email
- RBAC + resource-level authorization
- All DB queries parameterized (Prisma)
- Rate limiting per endpoint category
- Webhook signature verification
- Idempotency keys on financial operations
- Immutable audit logs
- UTC timestamps throughout

## Database

Schema covers 12 domains:
- identity, profiles, businesses, groups
- commitments (the core engine), milestones, evidence
- trust DNA, payments, ledger (double-entry)
- disputes, messaging, notifications
- audit (immutable), outbox, fraud, consent, feature flags

## Development Phases

| Phase | Status | Description |
|---|---|---|
| 1 | ✅ | Architecture |
| 2 | ✅ | Repository Setup |
| 3 | 🔄 | Identity & Auth |
| 4 | ⏳ | Businesses & Groups |
| 5 | ⏳ | Commitment Engine |
| 6 | ⏳ | Evidence & Verification |
| 7 | ⏳ | Trust DNA |
| 8 | ⏳ | Marketplace |
| 9 | ⏳ | Groups & Projects |
| 10 | ⏳ | Payments & Ledger |
| 11 | ⏳ | Disputes |
| 12 | ⏳ | Messaging & Notifications |
| 13 | ⏳ | AI Layer |
| 14 | ⏳ | Admin Platform |
| 15 | ⏳ | Testing & Hardening |
| 16 | ⏳ | Production Deployment |

## License

UNLICENSED — Proprietary. All rights reserved.
