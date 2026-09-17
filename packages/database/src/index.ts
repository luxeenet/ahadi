// Re-export Prisma client as the single access point for the database.
// All application code imports from '@ahadi/database', never directly from '@prisma/client'.

export { Prisma, PrismaClient } from '@prisma/client';
export * from '@prisma/client';

import { PrismaClient } from '@prisma/client';

// Singleton pattern for the PrismaClient to avoid too many connections.
// In NestJS, wrap this in a PrismaService (Injectable).
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  global.__prisma = prisma;
}
