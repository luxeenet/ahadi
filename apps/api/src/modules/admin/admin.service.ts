import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformOverview(): Promise<any> {
    const totalUsers = await this.prisma.user.count();
    const totalBusinesses = await this.prisma.business.count();
    const totalCommitments = await this.prisma.commitment.count();
    const totalDisputes = await this.prisma.dispute.count();

    return {
      metrics: {
        totalUsers,
        totalBusinesses,
        totalCommitments,
        totalDisputes,
        platformStatus: 'HEALTHY',
        uptime: '99.99%',
      },
      auditTrail: [
        { id: 'AUD-901', action: 'COMMITTMENT_CREATED', timestamp: new Date() },
        { id: 'AUD-902', action: 'EVIDENCE_VERIFIED', timestamp: new Date(Date.now() - 3600000) },
      ],
    };
  }
}
