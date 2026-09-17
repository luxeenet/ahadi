import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

/**
 * Global Redis module — provides an ioredis client to all modules.
 * Used for: caching, rate limiting, BullMQ queues, distributed locks,
 * session storage, idempotency keys.
 */
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigService): Redis => {
        const redisUrl = config.get<string>('REDIS_URL', 'redis://localhost:6379');
        const tls = config.get<boolean>('REDIS_TLS', false);

        const client = new Redis(redisUrl, {
          tls: tls ? {} : undefined,
          maxRetriesPerRequest: 3,
          lazyConnect: false,
          enableReadyCheck: true,
        });

        client.on('connect', () => console.log('[Redis] Connected'));
        client.on('error', (err: Error) => console.error('[Redis] Error:', err.message));
        client.on('reconnecting', () => console.warn('[Redis] Reconnecting...'));

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
