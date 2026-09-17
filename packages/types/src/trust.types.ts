// ============================================================
// Trust DNA Types
// ============================================================

export type TrustEntityType = 'USER' | 'BUSINESS';

export interface TrustScoreDimensions {
  reliability: number;   // 0-100: keeps promises
  completion: number;    // 0-100: completes what they start
  timeliness: number;    // 0-100: completes on time
  communication: number; // 0-100: responds, updates
  verified: number;      // 0-100: verified interactions weight
  overall: number;       // 0-100: weighted composite
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

// Score algorithm versions — historical results remain explainable
export const TRUST_SCORE_VERSIONS = {
  v1: {
    weights: {
      reliability: 0.30,
      completion: 0.25,
      timeliness: 0.25,
      communication: 0.10,
      verified: 0.10,
    },
  },
} as const;

export type TrustScoreVersion = keyof typeof TRUST_SCORE_VERSIONS;
