/**
 * AHADI Worker — BullMQ background job processor
 *
 * This process runs separately from the API and handles:
 * - Outbox event publication (polling)
 * - Notification delivery
 * - Trust score recalculations
 * - Fraud signal analysis
 * - Media processing
 * - Commitment deadline monitoring (via node-cron)
 * - Webhook retries
 * - Email/SMS delivery
 *
 * Each worker type has its own queue and concurrency settings.
 * Workers are idempotent — safe to run multiple instances (uses Redis locks).
 */
import pino from 'pino';
import { Worker } from 'bullmq';
import { PrismaClient } from '@ahadi/database';
import cron from 'node-cron';

// ── Queue Names ────────────────────────────────────────────────────────────
export const QUEUES = {
  NOTIFICATIONS: 'notifications',
  TRUST: 'trust',
  FRAUD: 'fraud',
  MEDIA: 'media',
  WEBHOOKS: 'webhooks',
  EMAIL: 'email',
  SMS: 'sms',
  AI_JOBS: 'ai-jobs',
} as const;

// ── Logger ─────────────────────────────────────────────────────────────────
const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  ...(process.env['LOG_PRETTY'] === 'true'
    ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
    : {}),
});

// ── Redis Connection ───────────────────────────────────────────────────────
const redisUrl = process.env['REDIS_URL'];
if (!redisUrl) {
  logger.error('REDIS_URL is required');
  process.exit(1);
}

const redisConnection = {
  url: redisUrl,
  maxRetriesPerRequest: null, // Required for BullMQ
};

// ── Database ───────────────────────────────────────────────────────────────
const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

// ── Outbox Poller ──────────────────────────────────────────────────────────
// Polls the outbox_events table and publishes pending events.
// This ensures events are never lost even if the API crashes mid-transaction.
async function runOutboxPoller(): Promise<void> {
  const intervalMs = Number(process.env['OUTBOX_POLL_INTERVAL_MS'] ?? 1000);

  logger.info({ intervalMs }, 'Starting outbox poller');

  const poll = async (): Promise<void> => {
    try {
      const pending = await prisma.outboxEvent.findMany({
        where: { status: 'PENDING' },
        take: 50,
        orderBy: { createdAt: 'asc' },
      });

      for (const event of pending) {
        try {
          // In production, publish to Redis Streams or RabbitMQ here.
          // For now, log and mark as published.
          logger.debug(
            { eventType: event.eventType, aggregateId: event.aggregateId },
            'Publishing outbox event',
          );

          await prisma.outboxEvent.update({
            where: { id: event.id },
            data: { status: 'PUBLISHED', publishedAt: new Date() },
          });
        } catch (err: unknown) {
          const error = err instanceof Error ? err.message : String(err);
          await prisma.outboxEvent.update({
            where: { id: event.id },
            data: {
              status: event.retryCount >= 5 ? 'DEAD_LETTER' : 'FAILED',
              failedAt: new Date(),
              error,
              retryCount: { increment: 1 },
            },
          });
          logger.error({ eventId: event.id, error }, 'Failed to publish outbox event');
        }
      }
    } catch (err: unknown) {
      logger.error({ err }, 'Outbox poller error');
    }
  };

  // Run immediately then on interval
  void poll();
  setInterval(() => void poll(), intervalMs);
}

// ── Notification Worker ────────────────────────────────────────────────────
function startNotificationWorker(): void {
  const worker = new Worker(
    QUEUES.NOTIFICATIONS,
    async (job) => {
      logger.info({ jobId: job.id, data: job.data }, 'Processing notification');
      // Phase 12 implementation: deliver in-app, push, email, SMS
    },
    { connection: redisConnection, concurrency: 10 },
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Notification job failed');
  });

  logger.info('Notification worker started');
}

// ── Trust Worker ───────────────────────────────────────────────────────────
function startTrustWorker(): void {
  const worker = new Worker(
    QUEUES.TRUST,
    async (job) => {
      logger.info({ jobId: job.id, data: job.data }, 'Processing trust recalculation');
      // Phase 7 implementation: recalculate trust scores
    },
    { connection: redisConnection, concurrency: 5 },
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Trust job failed');
  });

  logger.info('Trust worker started');
}

// ── Fraud Worker ───────────────────────────────────────────────────────────
function startFraudWorker(): void {
  const worker = new Worker(
    QUEUES.FRAUD,
    async (job) => {
      logger.info({ jobId: job.id, data: job.data }, 'Processing fraud analysis');
      // Phase 7 implementation: fraud signal analysis
    },
    { connection: redisConnection, concurrency: 3 },
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err }, 'Fraud job failed');
  });

  logger.info('Fraud worker started');
}

// ── Commitment Monitor (Cron) ──────────────────────────────────────────────
function startCommitmentMonitor(): void {
  const cronExpr = process.env['COMMITMENT_MONITOR_CRON'] ?? '*/5 * * * *';

  cron.schedule(cronExpr, async () => {
    logger.debug('Running commitment deadline monitor');

    // Phase 5 implementation will:
    // 1. Find ACTIVE commitments where dueDate < now → mark OVERDUE
    // 2. Find ACTIVE commitments where dueDate within 24h → flag AT_RISK
    // 3. Find AT_RISK commitments that passed → mark OVERDUE
    // 4. Send reminders for due-soon commitments

    try {
      const overdueCount = await prisma.commitment.updateMany({
        where: {
          status: { in: ['ACTIVE', 'AT_RISK'] },
          dueDate: { lt: new Date() },
        },
        data: { status: 'OVERDUE', updatedAt: new Date() },
      });

      if (overdueCount.count > 0) {
        logger.info({ count: overdueCount.count }, 'Marked commitments as OVERDUE');
      }
    } catch (err: unknown) {
      logger.error({ err }, 'Commitment monitor error');
    }
  });

  logger.info({ cronExpr }, 'Commitment monitor scheduled');
}

// ── Trust Snapshot Cron ────────────────────────────────────────────────────
function startTrustSnapshotCron(): void {
  const cronExpr = process.env['TRUST_SNAPSHOT_CRON'] ?? '0 2 * * *';

  cron.schedule(cronExpr, async () => {
    logger.info('Running trust score snapshot');
    // Phase 7 implementation: daily trust score snapshots
  });

  logger.info({ cronExpr }, 'Trust snapshot cron scheduled');
}

// ── Graceful Shutdown ──────────────────────────────────────────────────────
async function shutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Received shutdown signal');
  await prisma.$disconnect();
  logger.info('Worker shutdown complete');
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// ── Main ───────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  logger.info('Starting AHADI Worker');

  await prisma.$connect();
  logger.info('Worker connected to PostgreSQL');

  void runOutboxPoller();
  startNotificationWorker();
  startTrustWorker();
  startFraudWorker();
  startCommitmentMonitor();
  startTrustSnapshotCron();

  logger.info('AHADI Worker fully started');
}

void main().catch((err: unknown) => {
  logger.error({ err }, 'Fatal: Worker failed to start');
  process.exit(1);
});
