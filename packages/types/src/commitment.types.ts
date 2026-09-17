// ============================================================
// Commitment Types — shared across API and Worker
// ============================================================

export type CommitmentStatus =
  | 'DRAFT'
  | 'PROPOSED'
  | 'PENDING_ACCEPTANCE'
  | 'ACCEPTED'
  | 'ACTIVE'
  | 'AT_RISK'
  | 'OVERDUE'
  | 'PARTIALLY_COMPLETED'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'DISPUTED'
  | 'RESOLVED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'FAILED';

export type CommitmentCategory =
  | 'SERVICE'
  | 'DELIVERY'
  | 'PAYMENT'
  | 'PROJECT'
  | 'MILESTONE'
  | 'CONTRIBUTION'
  | 'APPOINTMENT'
  | 'RENT'
  | 'REPAIR'
  | 'SUPPLY'
  | 'CUSTOM';

export type CommitmentParticipantRole =
  | 'PROMISOR'
  | 'PROMISEE'
  | 'WITNESS'
  | 'GUARANTOR'
  | 'OBSERVER';

export type MilestoneStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'OVERDUE'
  | 'CANCELLED';

export type RiskLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type EvidenceType =
  | 'PHOTO'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'SIGNATURE'
  | 'LOCATION'
  | 'PAYMENT'
  | 'DELIVERY_SCAN'
  | 'SYSTEM_EVENT'
  | 'RECEIPT'
  | 'INVOICE'
  | 'OTHER';

export type EvidenceVerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'REJECTED' | 'DISPUTED';

export type VisibilityScope =
  | 'PRIVATE'
  | 'PARTICIPANTS_ONLY'
  | 'GROUP_ONLY'
  | 'VERIFIED_PARTNERS'
  | 'PUBLIC';

export type DisputeStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'EVIDENCE_REQUESTED'
  | 'MEDIATION'
  | 'RESOLVED'
  | 'ESCALATED'
  | 'CLOSED';

// State machine transitions — enforced in CommitmentStateMachine
export const VALID_TRANSITIONS: Record<CommitmentStatus, CommitmentStatus[]> = {
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
export const TERMINAL_STATUSES: CommitmentStatus[] = [
  'VERIFIED',
  'RESOLVED',
  'CANCELLED',
  'EXPIRED',
  'FAILED',
];

// System-only transitions (cannot be triggered by user)
export const SYSTEM_ONLY_TRANSITIONS: Array<{
  from: CommitmentStatus;
  to: CommitmentStatus;
}> = [
  { from: 'ACTIVE', to: 'AT_RISK' },
  { from: 'ACTIVE', to: 'OVERDUE' },
  { from: 'AT_RISK', to: 'OVERDUE' },
  { from: 'OVERDUE', to: 'EXPIRED' },
];
