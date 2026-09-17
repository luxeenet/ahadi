import Joi from 'joi';

/**
 * Joi validation schema for all environment variables.
 * The application will fail fast at startup if required variables are missing
 * or have invalid values. This prevents mysterious runtime failures.
 *
 * Add every new env variable here before using it in application code.
 */
export const envValidationSchema = Joi.object({
  // ── Application ────────────────────────────────────────────
  NODE_ENV: Joi.string().valid('development', 'test', 'staging', 'production').required(),
  PORT: Joi.number().port().default(3000),
  API_VERSION: Joi.string().default('v1'),
  APP_NAME: Joi.string().default('ahadi'),
  APP_URL: Joi.string().uri().required(),
  FRONTEND_URL: Joi.string().uri().required(),
  ADMIN_URL: Joi.string().uri().optional(),

  // ── Database ───────────────────────────────────────────────
  DATABASE_URL: Joi.string().required(),

  // ── Redis ──────────────────────────────────────────────────
  REDIS_URL: Joi.string().required(),
  REDIS_TLS: Joi.boolean().default(false),

  // ── Auth ───────────────────────────────────────────────────
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('30d'),

  // ── Object Storage ─────────────────────────────────────────
  STORAGE_PROVIDER: Joi.string().valid('minio', 's3', 'gcs', 'r2').default('minio'),
  STORAGE_ENDPOINT: Joi.string().uri().required(),
  STORAGE_REGION: Joi.string().default('us-east-1'),
  STORAGE_BUCKET_EVIDENCE: Joi.string().required(),
  STORAGE_BUCKET_AVATARS: Joi.string().required(),
  STORAGE_BUCKET_DOCUMENTS: Joi.string().required(),
  STORAGE_ACCESS_KEY: Joi.string().required(),
  STORAGE_SECRET_KEY: Joi.string().required(),

  // ── Email ──────────────────────────────────────────────────
  EMAIL_PROVIDER: Joi.string().valid('smtp', 'sendgrid', 'ses', 'mock').default('mock'),
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional().allow(''),
  SMTP_PASS: Joi.string().optional().allow(''),
  EMAIL_FROM: Joi.string().email().required(),
  EMAIL_FROM_NAME: Joi.string().default('AHADI'),

  // ── SMS ────────────────────────────────────────────────────
  SMS_PROVIDER: Joi.string().valid('mock', 'bongosms', 'africas_talking').default('mock'),
  SMS_MOCK_LOG: Joi.boolean().default(true),

  // ── Payments ───────────────────────────────────────────────
  PAYMENT_PROVIDER_DEFAULT: Joi.string()
    .valid('mock', 'mpesa', 'tigopesa', 'airtel_money', 'bank')
    .default('mock'),

  // ── AI ─────────────────────────────────────────────────────
  AI_PROVIDER: Joi.string().valid('mock', 'openai', 'google', 'anthropic').default('mock'),
  AI_MOCK_DELAY_MS: Joi.number().default(200),
  OPENAI_API_KEY: Joi.string().optional().allow(''),
  OPENAI_MODEL: Joi.string().optional(),
  GOOGLE_AI_API_KEY: Joi.string().optional().allow(''),
  GOOGLE_AI_MODEL: Joi.string().optional(),

  // ── Feature Flags ──────────────────────────────────────────
  FEATURE_AI_ENABLED: Joi.boolean().default(true),
  FEATURE_MARKETPLACE_ENABLED: Joi.boolean().default(true),
  FEATURE_ESCROW_ENABLED: Joi.boolean().default(false),
  FEATURE_FINANCIAL_PASSPORT_ENABLED: Joi.boolean().default(false),
  FEATURE_GROUPS_ENABLED: Joi.boolean().default(true),
  FEATURE_BUSINESS_VERIFICATION_ENABLED: Joi.boolean().default(true),
  FEATURE_DISPUTE_ENABLED: Joi.boolean().default(true),

  // ── Observability ──────────────────────────────────────────
  LOG_LEVEL: Joi.string().valid('trace', 'debug', 'info', 'warn', 'error', 'fatal').default('info'),
  LOG_PRETTY: Joi.boolean().default(false),
  SENTRY_DSN: Joi.string().uri().optional().allow(''),

  // ── Rate Limiting ──────────────────────────────────────────
  RATE_LIMIT_AUTH_MAX: Joi.number().default(10),
  RATE_LIMIT_AUTH_WINDOW_MS: Joi.number().default(60000),
  RATE_LIMIT_OTP_MAX: Joi.number().default(5),
  RATE_LIMIT_OTP_WINDOW_MS: Joi.number().default(300000),
  RATE_LIMIT_API_MAX: Joi.number().default(100),
  RATE_LIMIT_API_WINDOW_MS: Joi.number().default(60000),

  // ── Security ───────────────────────────────────────────────
  CORS_ORIGINS: Joi.string().required(),
  BCRYPT_ROUNDS: Joi.number().min(10).max(14).default(12),
  OTP_EXPIRY_MINUTES: Joi.number().default(10),
  OTP_MAX_ATTEMPTS: Joi.number().default(5),
  SESSION_EXPIRY_DAYS: Joi.number().default(30),

  // ── Worker ─────────────────────────────────────────────────
  WORKER_CONCURRENCY: Joi.number().default(5),
  OUTBOX_POLL_INTERVAL_MS: Joi.number().default(1000),
  COMMITMENT_MONITOR_CRON: Joi.string().default('*/5 * * * *'),
  TRUST_SNAPSHOT_CRON: Joi.string().default('0 2 * * *'),

  // ── Uploads ────────────────────────────────────────────────
  UPLOAD_MAX_FILE_SIZE_MB: Joi.number().default(50),
}).unknown(true); // Allow extra env vars (e.g., CI-injected)
