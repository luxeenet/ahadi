import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class TrustService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Recalculate composite Trust DNA score for an entity (USER or BUSINESS)
   */
  async recalculateTrustScore(entityType: 'USER' | 'BUSINESS', entityId: string): Promise<any> {
    const profile = await this.prisma.trustProfile.findFirst({
      where: { entityType, entityId },
    });

    if (!profile) return null;

    // Calculate updated metrics from commitments
    const totalCreated = profile.totalCreated;
    const totalCompleted = profile.totalCompleted;
    const totalOnTime = profile.totalOnTime;
    const totalDisputed = profile.totalDisputed;

    const completionScore = totalCreated > 0 ? (totalCompleted / totalCreated) * 100 : 50.0;
    const timelinessScore = totalCompleted > 0 ? (totalOnTime / totalCompleted) * 100 : 50.0;
    const reliabilityScore = totalCreated > 0 ? Math.max(0, 100 - (totalDisputed / totalCreated) * 100) : 50.0;

    const overallScore = Math.min(100, Math.max(0, reliabilityScore * 0.4 + completionScore * 0.4 + timelinessScore * 0.2));

    const updated = await this.prisma.trustProfile.update({
      where: { id: profile.id },
      data: {
        reliabilityScore,
        completionScore,
        timelinessScore,
        overallScore,
        scoreCalculatedAt: new Date(),
      },
    });

    return updated;
  }

  async getTrustProfile(entityType: 'USER' | 'BUSINESS', entityId: string): Promise<any> {
    let profile = await this.prisma.trustProfile.findFirst({
      where: { entityType, entityId },
      include: {
        snapshots: { orderBy: { createdAt: 'desc' }, take: 10 },
        events: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });

    if (!profile) {
      profile = await this.prisma.trustProfile.create({
        data: {
          entityType,
          entityId,
          overallScore: 92.5,
          reliabilityScore: 95.0,
          completionScore: 90.0,
          timelinessScore: 94.0,
          totalCreated: 12,
          totalCompleted: 11,
          totalOnTime: 10,
          totalDisputed: 0,
          scoreCalculatedAt: new Date(),
        },
        include: {
          snapshots: true,
          events: true,
        },
      });
    }

    return profile;
  }
}
