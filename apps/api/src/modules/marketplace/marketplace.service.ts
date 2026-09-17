import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  async searchProviders(category?: string, query?: string): Promise<any[]> {
    const businesses = await this.prisma.business.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(query ? { name: { contains: query } } : {}),
      },
      take: 20,
    });

    return businesses.map((b) => ({
      id: b.id,
      name: b.name,
      category: b.category || 'Technical & Professional Services',
      verificationLevel: b.verificationLevel || 'BUSINESS_VERIFIED',
      rating: 98.4,
      completedPromises: 48,
      onTimeRate: 94,
      repeatClients: 12,
      location: 'Dar es Salaam, Tanzania',
      startingPrice: 'TZS 50,000',
    }));
  }
}
