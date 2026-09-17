import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { envValidationSchema } from '@ahadi/config';

import { PrismaModule } from './common/database/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { StorageModule } from './common/storage/storage.module';

// ── Domain Modules ────────────────────────────────────────────────────────
import { AuthModule } from './modules/auth/auth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { GroupsModule } from './modules/groups/groups.module';
import { CommitmentsModule } from './modules/commitments/commitments.module';
import { CommitmentTemplatesModule } from './modules/commitment-templates/commitment-templates.module';
import { MilestonesModule } from './modules/milestones/milestones.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { VerificationModule } from './modules/verification/verification.module';
import { TrustModule } from './modules/trust/trust.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AiModule } from './modules/ai/ai.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { PublicModule } from './modules/public/public.module';

@Module({
  imports: [
    // ── Config: validates env vars at startup ──────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      cache: true,
    }),

    // ── Rate Limiting (global throttler) ───────────────────────────────────
    // Domain-specific limits are set per-controller with @Throttle() decorator
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,  // 1 minute
        limit: 100,
      },
    ]),

    // ── Infrastructure ─────────────────────────────────────────────────────
    PrismaModule,
    RedisModule,
    StorageModule,

    // ── Domain Modules ─────────────────────────────────────────────────────
    AuthModule,
    IdentityModule,
    ProfilesModule,
    BusinessesModule,
    GroupsModule,
    CommitmentsModule,
    CommitmentTemplatesModule,
    MilestonesModule,
    EvidenceModule,
    VerificationModule,
    TrustModule,
    MarketplaceModule,
    PaymentsModule,
    LedgerModule,
    DisputesModule,
    MessagingModule,
    NotificationsModule,
    AiModule,
    FraudModule,
    AuditModule,
    AdminModule,
    HealthModule,
    PublicModule,
  ],
})
export class AppModule {}
