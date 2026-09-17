export * from './errors/app-error';
export * from './errors/error-codes';
export * from './utils/id';
export * from './utils/date';
export * from './utils/pagination';

// ── Platform Constants ───────────────────────────────────────

export const AHADI_CONSTANTS = {
  PUBLIC_ID_PREFIX: 'AH',
  MAX_COMMITMENT_PARTICIPANTS: 20,
  MAX_MILESTONES_PER_COMMITMENT: 50,
  MAX_EVIDENCE_PER_COMMITMENT: 100,
  MAX_FILE_SIZE_MB: 50,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  PASSWORD_MIN_LENGTH: 8,
  BCRYPT_ROUNDS: 12,
  JWT_ACCESS_EXPIRY: '15m',
  JWT_REFRESH_EXPIRY_DAYS: 30,
  MAX_SESSION_DEVICES: 10,
  TRUST_SCORE_MIN: 0,
  TRUST_SCORE_MAX: 100,
  AT_RISK_THRESHOLD_DAYS: 3,   // Flag AT_RISK when < 3 days from deadline
  OVERDUE_GRACE_HOURS: 0,      // No grace period; overdue is overdue
} as const;

export const SUPPORTED_CURRENCIES = ['TZS', 'USD', 'KES', 'UGX', 'RWF', 'NGN', 'ZAR'] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const SUPPORTED_LOCALES = ['sw-TZ', 'en-TZ', 'en-KE', 'en-US'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const SUPPORTED_TIMEZONES = [
  'Africa/Dar_es_Salaam',
  'Africa/Nairobi',
  'Africa/Kampala',
  'Africa/Kigali',
  'UTC',
] as const;
