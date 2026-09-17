export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type PaymentProvider = 'MOCK' | 'MPESA' | 'TIGOPESA' | 'AIRTEL_MONEY' | 'BANK_TRANSFER' | 'CARD';
export type LedgerDirection = 'DEBIT' | 'CREDIT';
export type LedgerAccountType = 'RECEIVABLE' | 'PAYABLE' | 'ESCROW' | 'FEE' | 'SYSTEM';
export interface PaymentIntentRequest {
    commitmentId?: string;
    milestoneId?: string;
    payerId: string;
    payeeUserId?: string;
    payeeBusinessId?: string;
    amount: number;
    currency: string;
    description?: string;
    provider: PaymentProvider;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
}
export interface PaymentProviderResult {
    success: boolean;
    providerRef?: string;
    providerStatus: string;
    rawResponse?: unknown;
    errorCode?: string;
    errorMessage?: string;
}
export interface NormalizedWebhookPayload {
    provider: PaymentProvider;
    providerRef: string;
    idempotencyKey?: string;
    status: PaymentStatus;
    amount?: number;
    currency?: string;
    timestamp: Date;
    rawPayload: unknown;
}
export type LedgerTransactionType = 'PAYMENT_RECEIVED' | 'PAYMENT_SENT' | 'DEPOSIT' | 'WITHDRAWAL' | 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'FEE' | 'REFUND' | 'ADJUSTMENT';
export interface LedgerEntryInput {
    accountId: string;
    direction: LedgerDirection;
    amount: number;
}
//# sourceMappingURL=payment.types.d.ts.map