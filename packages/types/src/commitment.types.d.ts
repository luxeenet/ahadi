export type CommitmentStatus = 'DRAFT' | 'PROPOSED' | 'PENDING_ACCEPTANCE' | 'ACCEPTED' | 'ACTIVE' | 'AT_RISK' | 'OVERDUE' | 'PARTIALLY_COMPLETED' | 'COMPLETED' | 'VERIFIED' | 'DISPUTED' | 'RESOLVED' | 'CANCELLED' | 'EXPIRED' | 'FAILED';
export type CommitmentCategory = 'SERVICE' | 'DELIVERY' | 'PAYMENT' | 'PROJECT' | 'MILESTONE' | 'CONTRIBUTION' | 'APPOINTMENT' | 'RENT' | 'REPAIR' | 'SUPPLY' | 'CUSTOM';
export type CommitmentParticipantRole = 'PROMISOR' | 'PROMISEE' | 'WITNESS' | 'GUARANTOR' | 'OBSERVER';
export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | 'OVERDUE' | 'CANCELLED';
export type RiskLevel = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type EvidenceType = 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'SIGNATURE' | 'LOCATION' | 'PAYMENT' | 'DELIVERY_SCAN' | 'SYSTEM_EVENT' | 'RECEIPT' | 'INVOICE' | 'OTHER';
export type EvidenceVerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'REJECTED' | 'DISPUTED';
export type VisibilityScope = 'PRIVATE' | 'PARTICIPANTS_ONLY' | 'GROUP_ONLY' | 'VERIFIED_PARTNERS' | 'PUBLIC';
export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'EVIDENCE_REQUESTED' | 'MEDIATION' | 'RESOLVED' | 'ESCALATED' | 'CLOSED';
export declare const VALID_TRANSITIONS: Record<CommitmentStatus, CommitmentStatus[]>;
export declare const TERMINAL_STATUSES: CommitmentStatus[];
export declare const SYSTEM_ONLY_TRANSITIONS: Array<{
    from: CommitmentStatus;
    to: CommitmentStatus;
}>;
//# sourceMappingURL=commitment.types.d.ts.map