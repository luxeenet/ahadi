import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import pino from 'pino';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppExceptionFilter } from './common/filters/app-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  // ── Logger ────────────────────────────────────────────────────────────────
  const logger = pino({
    level: process.env['LOG_LEVEL'] ?? 'info',
    ...(process.env['LOG_PRETTY'] === 'true'
      ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
      : {}),
  });

  // ── App Factory ───────────────────────────────────────────────────────────
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false, // We use pino directly
      trustProxy: true,
    }),
    { bufferLogs: true },
  );

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const port = configService.get<number>('PORT', 3000);
  const appUrl = configService.get<string>('APP_URL', 'http://localhost:3000');
  const corsOrigins = configService.get<string>('CORS_ORIGINS', 'http://localhost:3000');
  const apiVersion = configService.get<string>('API_VERSION', 'v1');

  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = corsOrigins.split(',').map((o) => o.trim());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-Idempotency-Key',
      'Accept-Language',
    ],
  });

  // ── API Versioning ────────────────────────────────────────────────────────
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
    prefix: 'api/',
  });

  // ── Global Validation Pipe ────────────────────────────────────────────────
  // Validates and transforms all request DTOs.
  // whitelist: strips properties not in the DTO (prevents property injection)
  // forbidNonWhitelisted: throws on extra properties
  // transform: auto-transforms plain objects to class instances
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  );

  // ── Global Filters (Exception Handlers) ──────────────────────────────────
  // Order matters: AppExceptionFilter first, then HttpExceptionFilter as fallback
  app.useGlobalFilters(new HttpExceptionFilter(), new AppExceptionFilter());

  // ── Global Interceptors ───────────────────────────────────────────────────
  app.useGlobalInterceptors(
    new RequestIdInterceptor(),
    new LoggingInterceptor(logger),
    new ResponseInterceptor(),
  );

  // ── Swagger (development/staging only) ───────────────────────────────────
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('AHADI API')
      .setDescription(
        'AHADI — Universal Commitment & Trust Network API\n\n' +
          'All endpoints require authentication unless marked as public.\n' +
          'Use the Authorize button to set your Bearer token.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('auth', 'Authentication and session management')
      .addTag('users', 'User profiles and identity')
      .addTag('businesses', 'Business profiles and management')
      .addTag('groups', 'Groups and organizations')
      .addTag('commitments', 'The Commitment Engine')
      .addTag('milestones', 'Milestone management')
      .addTag('evidence', 'Evidence submission and verification')
      .addTag('trust', 'Trust DNA profiles')
      .addTag('marketplace', 'Service discovery')
      .addTag('payments', 'Payment intents and processing')
      .addTag('ledger', 'Financial ledger')
      .addTag('disputes', 'Dispute management')
      .addTag('messaging', 'Conversations and messages')
      .addTag('notifications', 'Notification management')
      .addTag('ai', 'AHADI AI assistants')
      .addTag('admin', 'Administrative endpoints')
      .addTag('public', 'Public verification endpoints (no auth)')
      .addTag('health', 'Health and readiness checks')
      .addServer(appUrl)
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    logger.info(`Swagger available at ${appUrl}/api/docs`);
  }

  // ── Start ─────────────────────────────────────────────────────────────────
  await app.listen(port, '0.0.0.0');
  logger.info(
    {
      port,
      nodeEnv,
      appUrl,
      apiPrefix: `api/${apiVersion}`,
    },
    `AHADI API started`,
  );
}

void bootstrap().catch((err: unknown) => {
  console.error('Fatal: Failed to start AHADI API', err);
  process.exit(1);
});
