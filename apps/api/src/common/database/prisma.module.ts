import { Module, Global } from '@nestjs/common';

import { PrismaService } from './prisma.service';

/**
 * PrismaModule is Global — no need to import it in every domain module.
 * PrismaService is available everywhere.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
