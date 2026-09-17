import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDispute(userId: string, data: { commitmentId: string; reason: string }): Promise<any> {
    const dispute = await this.prisma.dispute.create({
      data: {
        commitmentId: data.commitmentId,
        raisedById: userId,
        reason: data.reason,
        status: 'RAISED',
      },
    });

    // Update commitment state to DISPUTED
    await this.prisma.commitment.update({
      where: { id: data.commitmentId },
      data: { status: 'DISPUTED' },
    });

    return dispute;
  }

  async getDisputes(commitmentId?: string): Promise<any[]> {
    return this.prisma.dispute.findMany({
      where: {
        ...(commitmentId ? { commitmentId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
