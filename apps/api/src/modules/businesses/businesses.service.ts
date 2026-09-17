import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { AppError, ErrorCode, generateId, generatePublicId, generateSlug } from '@ahadi/shared';

export interface CreateBusinessDto {
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  locationLat?: number;
  locationLng?: number;
  serviceRadiusKm?: number;
}

@Injectable()
export class BusinessesService {
  constructor(private readonly prisma: PrismaService) {}

  async createBusiness(ownerId: string, dto: CreateBusinessDto): Promise<any> {
    const businessId = generateId();
    const publicId = generatePublicId('BUS');
    const slug = generateSlug(dto.name);

    const business = await this.prisma.$transaction(async (tx) => {
      const created = await tx.business.create({
        data: {
          id: businessId,
          publicId,
          ownerId,
          name: dto.name,
          slug,
          category: dto.category,
          subcategory: dto.subcategory,
          description: dto.description,
          logoUrl: dto.logoUrl,
          coverUrl: dto.coverUrl,
          phone: dto.phone,
          email: dto.email,
          website: dto.website,
          address: dto.address,
          locationLat: dto.locationLat,
          locationLng: dto.locationLng,
          serviceRadiusKm: dto.serviceRadiusKm,
          status: 'ACTIVE',
          verificationLevel: 'UNVERIFIED',
        },
      });

      await tx.businessMember.create({
        data: {
          id: generateId(),
          businessId,
          userId: ownerId,
          role: 'OWNER',
          joinedAt: new Date(),
        },
      });

      await tx.trustProfile.create({
        data: {
          id: generateId(),
          entityType: 'BUSINESS',
          businessId,
          entityId: businessId,
          reliabilityScore: 50.0,
          completionScore: 50.0,
          timelinessScore: 50.0,
          communicationScore: 50.0,
          verifiedScore: 0.0,
          overallScore: 50.0,
          scoreVersion: 'v1',
        },
      });

      return created;
    });

    return business;
  }

  async getBusiness(idOrSlug: string): Promise<any> {
    const business = await this.prisma.business.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }, { publicId: idOrSlug }],
        deletedAt: null,
      },
      include: {
        owner: { select: { id: true, publicId: true } },
        members: { include: { user: { select: { id: true, publicId: true } } } },
        services: true,
        verifications: true,
      },
    });

    if (!business) {
      throw new AppError(ErrorCode.BUSINESS_NOT_FOUND, 'Business not found', 404);
    }

    return business;
  }

  async listBusinesses(): Promise<any[]> {
    return this.prisma.business.findMany({
      where: { deletedAt: null },
      include: {
        services: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

