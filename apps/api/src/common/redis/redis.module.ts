import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

class MemoryRedisMock {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string): Promise<'OK'> {
    this.store.set(key, value);
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const existed = this.store.has(key);
    this.store.delete(key);
    return existed ? 1 : 0;
  }

  on(event: string, callback: Function) {
    if (event === 'connect') callback();
    return this;
  }
}

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigService): any => {
        const redisUrl = config.get<string>('REDIS_URL', 'mock');
        if (redisUrl === 'mock' || redisUrl === 'memory') {
          console.log('[Redis] Running in local in-memory fallback mode');
          return new MemoryRedisMock();
        }

        const tls = config.get<boolean>('REDIS_TLS', false);
        const client = new Redis(redisUrl, {
          tls: tls ? {} : undefined,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          retryStrategy: () => null,
        });

        client.on('error', (err: Error) => {
          console.warn('[Redis] Warning: Connection unavailable, using local fallback:', err.message);
        });

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
