import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';
import type { Logger } from 'pino';

/**
 * Logs every request with timing information.
 * Logs at INFO on success, WARN on 4xx, ERROR on 5xx.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const { method, url } = request;
    const requestId = request.headers['x-request-id'] as string | undefined;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - startTime;
          this.logger.info(
            { requestId, method, url, ms },
            `${method} ${url} ${ms}ms`,
          );
        },
        error: (error: unknown) => {
          const ms = Date.now() - startTime;
          const status =
            typeof error === 'object' &&
            error !== null &&
            'statusCode' in error
              ? (error as { statusCode: number }).statusCode
              : 500;
          const level = status >= 500 ? 'error' : 'warn';
          this.logger[level](
            { requestId, method, url, ms, status },
            `${method} ${url} ${status} ${ms}ms`,
          );
        },
      }),
    );
  }
}
