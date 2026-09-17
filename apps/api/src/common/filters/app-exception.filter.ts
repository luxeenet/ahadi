import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { AppError } from '@ahadi/shared';

/**
 * Catches all AppError instances (domain errors) and maps them to the
 * standard AHADI error envelope.
 *
 * Never exposes internal error details (stack traces, SQL, etc.) in production.
 */
@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: AppError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const requestId = (request.headers['x-request-id'] as string | undefined) ?? 'unknown';
    const isProd = process.env['NODE_ENV'] === 'production';

    if (!exception.isOperational) {
      // Non-operational errors are programming errors — log the full stack
      this.logger.error(
        {
          requestId,
          code: exception.code,
          message: exception.message,
          stack: exception.stack,
        },
        'Non-operational error',
      );
    } else if (exception.statusCode >= 500) {
      this.logger.error({ requestId, code: exception.code, message: exception.message }, 'AppError 5xx');
    } else {
      this.logger.warn({ requestId, code: exception.code, message: exception.message }, 'AppError 4xx');
    }

    const statusCode = exception.isOperational ? exception.statusCode : 500;
    const message = !exception.isOperational && isProd
      ? 'An internal error occurred'
      : exception.message;

    void response.status(statusCode).send({
      success: false,
      error: {
        code: !exception.isOperational && isProd ? 'INTERNAL_ERROR' : exception.code,
        message,
        details: exception.details,
        requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
