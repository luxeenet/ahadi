import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Catches NestJS HttpException and maps to the standard AHADI error envelope.
 * This handles validation errors, 404s from route guards, etc.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const requestId = (request.headers['x-request-id'] as string | undefined) ?? 'unknown';

    // Extract validation errors from class-validator
    let code = 'HTTP_ERROR';
    let message = exception.message;
    let details: unknown[] | undefined;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const res = exceptionResponse as Record<string, unknown>;
      if (Array.isArray(res['message'])) {
        // class-validator validation errors
        code = 'VALIDATION_FAILED';
        details = res['message'] as unknown[];
        message = 'Validation failed';
      } else if (typeof res['message'] === 'string') {
        message = res['message'];
      }
    }

    if (status === HttpStatus.NOT_FOUND) code = 'NOT_FOUND';
    if (status === HttpStatus.UNAUTHORIZED) code = 'UNAUTHORIZED';
    if (status === HttpStatus.FORBIDDEN) code = 'FORBIDDEN';
    if (status === HttpStatus.TOO_MANY_REQUESTS) code = 'RATE_LIMIT_EXCEEDED';

    // Log 5xx errors; 4xx are expected client errors
    if (status >= 500) {
      this.logger.error({ requestId, status, message }, 'HTTP 5xx Error');
    }

    void response.status(status).send({
      success: false,
      error: {
        code,
        message,
        details,
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
