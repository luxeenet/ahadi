export * from './errors/app-error';
export * from './errors/error-codes';
export * from './utils/id';
export * from './utils/date';
export * from './utils/pagination';
export declare const AHADI_CONSTANTS: {
    readonly PUBLIC_ID_PREFIX: "AH";
    readonly MAX_COMMITMENT_PARTICIPANTS: 20;
    readonly MAX_MILESTONES_PER_COMMITMENT: 50;
    readonly MAX_EVIDENCE_PER_COMMITMENT: 100;
    readonly MAX_FILE_SIZE_MB: 50;
    readonly OTP_LENGTH: 6;
    readonly OTP_EXPIRY_MINUTES: 10;
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly BCRYPT_ROUNDS: 12;
    readonly JWT_ACCESS_EXPIRY: "15m";
    readonly JWT_REFRESH_EXPIRY_DAYS: 30;
    readonly MAX_SESSION_DEVICES: 10;
    readonly TRUST_SCORE_MIN: 0;
    readonly TRUST_SCORE_MAX: 100;
    readonly AT_RISK_THRESHOLD_DAYS: 3;
    readonly OVERDUE_GRACE_HOURS: 0;
};
export declare const SUPPORTED_CURRENCIES: readonly ["TZS", "USD", "KES", "UGX", "RWF", "NGN", "ZAR"];
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
export declare const SUPPORTED_LOCALES: readonly ["sw-TZ", "en-TZ", "en-KE", "en-US"];
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export declare const SUPPORTED_TIMEZONES: readonly ["Africa/Dar_es_Salaam", "Africa/Nairobi", "Africa/Kampala", "Africa/Kigali", "UTC"];
//# sourceMappingURL=index.d.ts.map