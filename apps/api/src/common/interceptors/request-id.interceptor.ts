import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest, FastifyReply } from 'fastify';
import { generateId } from '@ahadi/shared';

/**
 * Assigns a unique request ID to every incoming request.
 * Uses the X-Request-Id header if provided by the client/proxy,
 * otherwise generates a fresh ULID.
 *
 * The request ID is propagated:
 * - Into the request headers for downstream use
 * - Into the response headers
 * - Into all log entries via the logging interceptor
 * - Into all error responses
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const response = http.getResponse<FastifyReply>();

    const requestId =
      (request.headers['x-request-id'] as string | undefined) ?? generateId();

    // Attach to request for downstream access
    (request.headers as Record<string, string>)['x-request-id'] = requestId;

    // Return in response headers
    void response.header('X-Request-Id', requestId);

    return next.handle();
  }
}
