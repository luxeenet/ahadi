import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyRequest } from 'fastify';

/**
 * Wraps all successful responses in the standard AHADI success envelope.
 *
 * If a controller method returns:
 *   { user: { id: '...' } }
 *
 * The client receives:
 *   {
 *     success: true,
 *     data: { user: { id: '...' } },
 *     meta: { requestId: '...', timestamp: '...' }
 *   }
 *
 * Controllers that need custom response handling can use @SkipResponseInterceptor()
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const requestId = (request.headers['x-request-id'] as string | undefined) ?? 'unknown';

    return next.handle().pipe(
      map((data: unknown) => {
        // If the controller already returned an envelope, pass through
        if (
          data !== null &&
          typeof data === 'object' &&
          'success' in (data as Record<string, unknown>)
        ) {
          return data;
        }

        return {
          success: true,
          data,
          meta: {
            requestId,
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
