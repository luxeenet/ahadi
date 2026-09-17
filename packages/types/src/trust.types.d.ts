export type TrustEntityType = 'USER' | 'BUSINESS';
export interface TrustScoreDimensions {
    reliability: number;
    completion: number;
    timeliness: number;
    communication: number;
    verified: number;
    overall: number;
}
export interface TrustMetricRaw {
    totalCreated: number;
    totalAccepted: number;
    totalCompleted: number;
    totalVerified: number;
    totalCancelled: number;
    totalDisputed: number;
    totalResolved: number;
    totalOverdue: number;
    totalEarly: number;
    totalOnTime: number;
    totalLate: number;
}
export interface TrustScoreExplanation {
    entityType: TrustEntityType;
    entityId: string;
    algorithmVersion: string;
    calculatedAt: Date;
    scores: TrustScoreDimensions;
    metrics: TrustMetricRaw;
    factors: TrustExplanationFactor[];
    lastNDays?: TrustRecentPeriodSummary;
}
export interface TrustExplanationFactor {
    dimension: keyof TrustScoreDimensions;
    label: string;
    value: number;
    weight: number;
    explanation: string;
}
export interface TrustRecentPeriodSummary {
    days: number;
    completed: number;
    onTime: number;
    late: number;
    overdue: number;
    cancelled: number;
}
export declare const TRUST_SCORE_VERSIONS: {
    readonly v1: {
        readonly weights: {
            readonly reliability: 0.3;
            readonly completion: 0.25;
            readonly timeliness: 0.25;
            readonly communication: 0.1;
            readonly verified: 0.1;
        };
    };
};
export type TrustScoreVersion = keyof typeof TRUST_SCORE_VERSIONS;
//# sourceMappingURL=trust.types.d.ts.map