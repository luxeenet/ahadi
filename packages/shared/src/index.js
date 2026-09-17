"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_TIMEZONES = exports.SUPPORTED_LOCALES = exports.SUPPORTED_CURRENCIES = exports.AHADI_CONSTANTS = void 0;
__exportStar(require("./errors/app-error"), exports);
__exportStar(require("./errors/error-codes"), exports);
__exportStar(require("./utils/id"), exports);
__exportStar(require("./utils/date"), exports);
__exportStar(require("./utils/pagination"), exports);
// ── Platform Constants ───────────────────────────────────────
exports.AHADI_CONSTANTS = {
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
    AT_RISK_THRESHOLD_DAYS: 3, // Flag AT_RISK when < 3 days from deadline
    OVERDUE_GRACE_HOURS: 0, // No grace period; overdue is overdue
};
exports.SUPPORTED_CURRENCIES = ['TZS', 'USD', 'KES', 'UGX', 'RWF', 'NGN', 'ZAR'];
exports.SUPPORTED_LOCALES = ['sw-TZ', 'en-TZ', 'en-KE', 'en-US'];
exports.SUPPORTED_TIMEZONES = [
    'Africa/Dar_es_Salaam',
    'Africa/Nairobi',
    'Africa/Kampala',
    'Africa/Kigali',
    'UTC',
];
//# sourceMappingURL=index.js.map