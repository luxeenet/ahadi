import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { AppError, ErrorCode, generateId, generatePublicId } from '@ahadi/shared';
import { CommitmentStatus } from '@ahadi/types';

export interface CreateCommitmentDto {
  templateId?: string;
  parentId?: string;
  promisorType: 'USER' | 'BUSINESS';
  promisorUserId?: string;
  promisorBusinessId?: string;
  promiseeType: 'USER' | 'BUSINESS' | 'GROUP';
  promiseeUserId?: string;
  promiseeBusinessId?: string;
  promiseeGroupId?: string;
  title: string;
  description?: string;
  category: string;
  scope?: string;
  deliverables?: any;
  startDate?: string;
  dueDate?: string;
  locationText?: string;
  locationLat?: number;
  locationLng?: number;
  value?: number;
  currency?: string;
  paymentTerms?: any;
  metadata?: any;
}

export interface TransitionStateDto {
  toStatus: CommitmentStatus;
  reason?: string;
  actorId: string;
}

@Injectable()
export class CommitmentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Allowed state transitions map
   */
  private readonly ALLOWED_TRANSITIONS: Record<string, string[]> = {
    DRAFT: ['PROPOSED', 'CANCELLED'],
    PROPOSED: ['PENDING_ACCEPTANCE', 'CANCELLED'],
    PENDING_ACCEPTANCE: ['ACCEPTED', 'CANCELLED'],
    ACCEPTED: ['ACTIVE', 'CANCELLED'],
    ACTIVE: ['AT_RISK', 'OVERDUE', 'PARTIALLY_COMPLETED', 'COMPLETED', 'DISPUTED', 'CANCELLED'],
    AT_RISK: ['ACTIVE', 'OVERDUE', 'COMPLETED', 'DISPUTED', 'CANCELLED'],
    OVERDUE: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
    PARTIALLY_COMPLETED: ['ACTIVE', 'COMPLETED', 'DISPUTED', 'CANCELLED'],
    COMPLETED: ['VERIFIED', 'DISPUTED'],
    DISPUTED: ['RESOLVED'],
    VERIFIED: [],
    RESOLVED: [],
    CANCELLED: [],
    EXPIRED: [],
    FAILED: [],
  };

  /**
   * Create a new commitment in DRAFT status
   */
  async createCommitment(creatorId: string, dto: CreateCommitmentDto): Promise<any> {
    const commitmentId = generateId();
    const publicId = generatePublicId('AH');

    const commitment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.commitment.create({
        data: {
          id: commitmentId,
          publicId,
          creatorId,
          templateId: dto.templateId,
          parentId: dto.parentId,
          promisorType: dto.promisorType,
          promisorUserId: dto.promisorUserId || (dto.promisorType === 'USER' ? creatorId : undefined),
          promisorBusinessId: dto.promisorBusinessId,
          promiseeType: dto.promiseeType,
          promiseeUserId: dto.promiseeUserId,
          promiseeBusinessId: dto.promiseeBusinessId,
          promiseeGroupId: dto.promiseeGroupId,
          title: dto.title,
          description: dto.description,
          category: dto.category as any,
          scope: dto.scope,
          deliverables: dto.deliverables,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          locationText: dto.locationText,
          locationLat: dto.locationLat,
          locationLng: dto.locationLng,
          value: dto.value,
          currency: dto.currency || 'TZS',
          paymentTerms: dto.paymentTerms,
          status: 'DRAFT',
          metadata: dto.metadata,
        },
      });

      // Record initial state transition event
      await tx.commitmentEvent.create({
        data: {
          id: generateId(),
          commitmentId,
          type: 'STATUS_CHANGED',
          fromStatus: null,
          toStatus: 'DRAFT',
          actorId: creatorId,
          actorType: 'USER',
          note: 'Commitment created in DRAFT status',
        },
      });

      // Add creator as participant
      await tx.commitmentParticipant.create({
        data: {
          id: generateId(),
          commitmentId,
          userId: creatorId,
          role: dto.promisorType === 'USER' && (dto.promisorUserId === creatorId || !dto.promisorUserId) ? 'PROMISOR' : 'PROMISEE',
          acceptedAt: new Date(),
        },
      });

      return created;
    });

    return commitment;
  }

  /**
   * Transition commitment status with state machine checks
   */
  async transitionStatus(commitmentId: string, dto: TransitionStateDto): Promise<any> {
    const commitment = await this.prisma.commitment.findUnique({
      where: { id: commitmentId, deletedAt: null },
    });

    if (!commitment) {
      throw new AppError(ErrorCode.COMMITMENT_NOT_FOUND, 'Commitment not found', 404);
    }

    const currentStatus = commitment.status;
    const allowed = this.ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(dto.toStatus)) {
      throw new AppError(
        ErrorCode.INVALID_STATUS_TRANSITION,
        `Cannot transition commitment status from ${currentStatus} to ${dto.toStatus}`,
        400,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.commitment.update({
        where: { id: commitmentId },
        data: {
          status: dto.toStatus as any,
          completedAt: dto.toStatus === 'COMPLETED' ? new Date() : commitment.completedAt,
          verifiedAt: dto.toStatus === 'VERIFIED' ? new Date() : commitment.verifiedAt,
        },
      });

      await tx.commitmentEvent.create({
        data: {
          id: generateId(),
          commitmentId,
          type: 'STATUS_CHANGED',
          fromStatus: currentStatus,
          toStatus: dto.toStatus,
          actorId: dto.actorId,
          actorType: 'USER',
          note: dto.reason,
        },
      });

      return updated;
    });
  }

  /**
   * Fetch single commitment by ID or Public ID
   */
  async getCommitment(idOrPublicId: string): Promise<any> {
    const commitment = await this.prisma.commitment.findFirst({
      where: {
        OR: [{ id: idOrPublicId }, { publicId: idOrPublicId }],
        deletedAt: null,
      },
      include: {
        creator: { select: { id: true, publicId: true } },
        participants: true,
        milestones: true,
        terms: true,
        events: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!commitment) {
      throw new AppError(ErrorCode.COMMITMENT_NOT_FOUND, 'Commitment not found', 404);
    }

    return commitment;
  }

  /**
   * List commitments for a user
   */
  async listCommitments(userId: string): Promise<any[]> {
    return this.prisma.commitment.findMany({
      where: {
        OR: [
          { creatorUserId: userId },
          { promisorUserId: userId },
          { promiseeUserId: userId },
        ],
        deletedAt: null,
      },
      include: {
        participants: true,
        milestones: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

