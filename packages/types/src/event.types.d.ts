export type DomainEventVersion = 'v1';
export interface BaseDomainEvent {
    eventId: string;
    eventType: string;
    eventVersion: DomainEventVersion;
    aggregateType: string;
    aggregateId: string;
    occurredAt: Date;
    metadata?: Record<string, unknown>;
}
export interface UserRegisteredEvent extends BaseDomainEvent {
    eventType: 'UserRegistered';
    aggregateType: 'User';
    payload: {
        userId: string;
        email?: string;
        phone?: string;
    };
}
export interface UserVerifiedEvent extends BaseDomainEvent {
    eventType: 'UserVerified';
    aggregateType: 'User';
    payload: {
        userId: string;
        verificationLevel: string;
    };
}
export interface BusinessCreatedEvent extends BaseDomainEvent {
    eventType: 'BusinessCreated';
    aggregateType: 'Business';
    payload: {
        businessId: string;
        ownerId: string;
        category: string;
        name: string;
    };
}
export interface BusinessVerifiedEvent extends BaseDomainEvent {
    eventType: 'BusinessVerified';
    aggregateType: 'Business';
    payload: {
        businessId: string;
        verificationLevel: string;
        verifiedBy: string;
    };
}
export interface CommitmentCreatedEvent extends BaseDomainEvent {
    eventType: 'CommitmentCreated';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        publicId: string;
        creatorId: string;
        category: string;
        templateId?: string;
        promisorId: string;
        promiseeId: string;
        dueDate?: Date;
        value?: number;
        currency?: string;
    };
}
export interface CommitmentProposedEvent extends BaseDomainEvent {
    eventType: 'CommitmentProposed';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        promisorId: string;
        promiseeId: string;
    };
}
export interface CommitmentAcceptedEvent extends BaseDomainEvent {
    eventType: 'CommitmentAccepted';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        acceptedBy: string;
        acceptedAt: Date;
    };
}
export interface CommitmentStartedEvent extends BaseDomainEvent {
    eventType: 'CommitmentStarted';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        startedAt: Date;
    };
}
export interface CommitmentAtRiskEvent extends BaseDomainEvent {
    eventType: 'CommitmentAtRisk';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        riskSignals: string[];
        daysUntilDue?: number;
    };
}
export interface CommitmentOverdueEvent extends BaseDomainEvent {
    eventType: 'CommitmentOverdue';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        hoursOverdue: number;
        dueDate: Date;
    };
}
export interface CommitmentCompletedEvent extends BaseDomainEvent {
    eventType: 'CommitmentCompleted';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        completedBy: string;
        completedAt: Date;
        wasEarly: boolean;
        wasOnTime: boolean;
        wasLate: boolean;
        daysEarlyOrLate: number;
    };
}
export interface CommitmentVerifiedEvent extends BaseDomainEvent {
    eventType: 'CommitmentVerified';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        verifiedBy: string;
        verifiedAt: Date;
    };
}
export interface CommitmentCancelledEvent extends BaseDomainEvent {
    eventType: 'CommitmentCancelled';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        cancelledBy: string;
        reason: string;
    };
}
export interface CommitmentDisputedEvent extends BaseDomainEvent {
    eventType: 'CommitmentDisputed';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        disputeId: string;
        raisedBy: string;
        reason: string;
    };
}
export interface CommitmentResolvedEvent extends BaseDomainEvent {
    eventType: 'CommitmentResolved';
    aggregateType: 'Commitment';
    payload: {
        commitmentId: string;
        disputeId: string;
        resolution: string;
        resolvedBy: string;
    };
}
export interface MilestoneCompletedEvent extends BaseDomainEvent {
    eventType: 'MilestoneCompleted';
    aggregateType: 'Milestone';
    payload: {
        milestoneId: string;
        commitmentId: string;
        completedBy: string;
        completedAt: Date;
    };
}
export interface EvidenceSubmittedEvent extends BaseDomainEvent {
    eventType: 'EvidenceSubmitted';
    aggregateType: 'Evidence';
    payload: {
        evidenceId: string;
        commitmentId: string;
        milestoneId?: string;
        type: string;
        uploadedBy: string;
    };
}
export interface EvidenceVerifiedEvent extends BaseDomainEvent {
    eventType: 'EvidenceVerified';
    aggregateType: 'Evidence';
    payload: {
        evidenceId: string;
        commitmentId: string;
        verifiedBy: string;
    };
}
export interface PaymentInitiatedEvent extends BaseDomainEvent {
    eventType: 'PaymentInitiated';
    aggregateType: 'Payment';
    payload: {
        paymentIntentId: string;
        commitmentId?: string;
        amount: number;
        currency: string;
        provider: string;
        payerId: string;
    };
}
export interface PaymentSucceededEvent extends BaseDomainEvent {
    eventType: 'PaymentSucceeded';
    aggregateType: 'Payment';
    payload: {
        paymentIntentId: string;
        commitmentId?: string;
        amount: number;
        currency: string;
        providerRef: string;
        settledAt: Date;
    };
}
export interface PaymentFailedEvent extends BaseDomainEvent {
    eventType: 'PaymentFailed';
    aggregateType: 'Payment';
    payload: {
        paymentIntentId: string;
        commitmentId?: string;
        reason: string;
        errorCode?: string;
    };
}
export interface TrustScoreRecalculatedEvent extends BaseDomainEvent {
    eventType: 'TrustScoreRecalculated';
    aggregateType: 'TrustProfile';
    payload: {
        entityType: string;
        entityId: string;
        oldScore?: number;
        newScore: number;
        algorithmVersion: string;
    };
}
export interface FraudSignalDetectedEvent extends BaseDomainEvent {
    eventType: 'FraudSignalDetected';
    aggregateType: 'FraudSignal';
    payload: {
        signalId: string;
        entityType: string;
        entityId: string;
        signalType: string;
        confidence: number;
    };
}
export type DomainEvent = UserRegisteredEvent | UserVerifiedEvent | BusinessCreatedEvent | BusinessVerifiedEvent | CommitmentCreatedEvent | CommitmentProposedEvent | CommitmentAcceptedEvent | CommitmentStartedEvent | CommitmentAtRiskEvent | CommitmentOverdueEvent | CommitmentCompletedEvent | CommitmentVerifiedEvent | CommitmentCancelledEvent | CommitmentDisputedEvent | CommitmentResolvedEvent | MilestoneCompletedEvent | EvidenceSubmittedEvent | EvidenceVerifiedEvent | PaymentInitiatedEvent | PaymentSucceededEvent | PaymentFailedEvent | TrustScoreRecalculatedEvent | FraudSignalDetectedEvent;
export type DomainEventType = DomainEvent['eventType'];
//# sourceMappingURL=event.types.d.ts.map