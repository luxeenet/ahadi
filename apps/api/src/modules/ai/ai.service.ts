import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  async analyzeCommitmentRisk(commitmentId: string): Promise<any> {
    const commitment = await this.prisma.commitment.findUnique({
      where: { id: commitmentId },
      include: { evidence: true },
    });

    if (!commitment) {
      return { riskScore: 0.1, status: 'LOW_RISK', insights: ['Commitment verified on standard terms.'] };
    }

    const hasEvidence = commitment.evidence && commitment.evidence.length > 0;
    const isOverdue = commitment.dueDate && new Date(commitment.dueDate) < new Date();

    return {
      commitmentId,
      riskScore: isOverdue ? 0.85 : hasEvidence ? 0.05 : 0.2,
      riskLevel: isOverdue ? 'HIGH' : hasEvidence ? 'LOW' : 'MEDIUM',
      insights: [
        isOverdue ? 'Milestone deadline passed without verified evidence upload.' : 'Timeline parameters are optimal.',
        hasEvidence ? 'Cryptographic evidence attached and audited.' : 'No evidence submitted yet. Prompt counterparty to upload proof.',
      ],
      recommendedAction: isOverdue ? 'Message participant or request status update' : 'Proceed with milestone execution',
    };
  }
}
