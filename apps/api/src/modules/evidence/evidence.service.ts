import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { AppError, ErrorCode, generateId } from '@ahadi/shared';
import { EvidenceType } from '@ahadi/types';



export interface SubmitEvidenceDto {
  commitmentId: string;
  milestoneId?: string;
  type: EvidenceType;
  title?: string;
  description?: string;
  fileUrl?: string;
  fileKey?: string;
  fileHash?: string;
  fileSize?: number;
  mimeType?: string;
  locationLat?: number;
  locationLng?: number;
}

@Injectable()
export class EvidenceService {
  constructor(private readonly prisma: PrismaService) {}

  async submitEvidence(userId: string, dto: SubmitEvidenceDto): Promise<any> {
    const commitment = await this.prisma.commitment.findUnique({
      where: { id: dto.commitmentId },
    });

    if (!commitment) {
      throw new AppError(ErrorCode.COMMITMENT_NOT_FOUND, 'Commitment not found', 404);
    }

    const evidenceId = generateId();
    return this.prisma.$transaction(async (tx) => {
      const evidence = await tx.commitmentEvidence.create({
        data: {
          id: evidenceId,
          commitmentId: dto.commitmentId,
          milestoneId: dto.milestoneId,
          uploadedById: userId,
          type: dto.type,
          title: dto.title,
          description: dto.description,
          fileUrl: dto.fileUrl,
          fileKey: dto.fileKey,
          fileHash: dto.fileHash,
          fileSize: dto.fileSize ? BigInt(dto.fileSize) : null,
          mimeType: dto.mimeType,
          locationLat: dto.locationLat,
          locationLng: dto.locationLng,
          serverTime: new Date(),
          verificationStatus: 'UNVERIFIED' as any,

        },
      });

      await tx.commitmentEvent.create({
        data: {
          id: generateId(),
          commitmentId: dto.commitmentId,
          type: 'EVIDENCE_ADDED',
          actorId: userId,
          actorType: 'USER',
          note: `Evidence uploaded: ${dto.title || dto.type}`,
        },
      });

      return evidence;
    });
  }

  async listEvidence(commitmentId: string): Promise<any[]> {
    const items = await this.prisma.commitmentEvidence.findMany({
      where: { commitmentId },
      include: {
        uploadedBy: { select: { id: true, publicId: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      ...item,
      fileSize: item.fileSize ? item.fileSize.toString() : null,
    }));
  }
}
