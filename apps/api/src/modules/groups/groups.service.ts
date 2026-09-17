import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(creatorUserId: string, data: { name: string; type?: any; description?: string }): Promise<any> {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 10000);
    const group = await this.prisma.group.create({
      data: {
        publicId: `GRP-${Math.floor(100000 + Math.random() * 900000)}`,
        name: data.name,
        slug,
        type: 'COMMUNITY',
        description: data.description,
        createdById: creatorUserId,
        members: {
          create: {
            userId: creatorUserId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: true,
      },
    });

    return group;
  }

  async getUserGroups(userId: string): Promise<any[]> {
    const memberships = await this.prisma.groupMember.findMany({
      where: { userId },
      include: {
        group: true,
      },
    });

    return memberships.map((m: any) => ({
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
