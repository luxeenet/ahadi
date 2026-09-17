"use strict";
// ============================================================
// Commitment Types — shared across API and Worker
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_ONLY_TRANSITIONS = exports.TERMINAL_STATUSES = exports.VALID_TRANSITIONS = void 0;
// State machine transitions — enforced in CommitmentStateMachine
exports.VALID_TRANSITIONS = {
    DRAFT: ['PROPOSED', 'CANCELLED'],
    PROPOSED: ['PENDING_ACCEPTANCE', 'CANCELLED'],
    PENDING_ACCEPTANCE: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['ACTIVE', 'CANCELLED'],
    ACTIVE: ['AT_RISK', 'OVERDUE', 'PARTIALLY_COMPLETED', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'FAILED'],
    AT_RISK: ['ACTIVE', 'OVERDUE', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'FAILED'],
    OVERDUE: ['COMPLETED', 'CANCELLED', 'DISPUTED', 'FAILED', 'EXPIRED'],
    PARTIALLY_COMPLETED: ['COMPLETED', 'ACTIVE', 'DISPUTED', 'CANCELLED'],
    COMPLETED: ['VERIFIED', 'DISPUTED'],
    VERIFIED: [],
    DISPUTED: ['RESOLVED'],
    RESOLVED: [],
    CANCELLED: [],
    EXPIRED: [],
    FAILED: [],
};
// Terminal states — no further transitions allowed
exports.TERMINAL_STATUSES = [
    'VERIFIED',
    'RESOLVED',
    'CANCELLED',
    'EXPIRED',
    'FAILED',
];
// System-only transitions (cannot be triggered by user)
exports.SYSTEM_ONLY_TRANSITIONS = [
    { from: 'ACTIVE', to: 'AT_RISK' },
    { from: 'ACTIVE', to: 'OVERDUE' },
    { from: 'AT_RISK', to: 'OVERDUE' },
    { from: 'OVERDUE', to: 'EXPIRED' },
];
//# sourceMappingURL=commitment.types.js.map