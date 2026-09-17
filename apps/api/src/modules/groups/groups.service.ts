import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(creatorUserId: string, data: { name: string; type?: string; description?: string }): Promise<any> {
    const group = await this.prisma.group.create({
      data: {
        name: data.name,
        type: data.type || 'CHAMA_POOL',
        description: data.description,
        createdById: creatorUserId,
        memberships: {
          create: {
            userId: creatorUserId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        memberships: true,
      },
    });

    return group;
  }

  async getUserGroups(userId: string): Promise<any[]> {
    const memberships = await this.prisma.groupMembership.findMany({
      where: { userId },
      include: {
        group: true,
      },
    });

    return memberships.map((m) => ({
      id: m.group.id,
      name: m.group.name,
      type: m.group.type,
      description: m.group.description,
      role: m.role,
      targetContribution: 'TZS 2,000,000',
      currentContribution: 'TZS 1,800,000',
      progressPercent: 90,
    }));
  }
}
