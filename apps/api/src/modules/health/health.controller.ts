import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../common/database/prisma.service';

interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  version: string;
}

interface ReadinessStatus extends HealthStatus {
  checks: {
    database: 'ok' | 'error';
    redis?: 'ok' | 'error';
  };
}

/**
 * Health check endpoints.
 * - /health/live  — liveness (is the process running?)
 * - /health/ready — readiness (can it serve traffic? DB connected?)
 * - /health       — detailed status (for monitoring dashboards)
 */
@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Liveness probe — just checks if the process is alive */
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  getLiveness(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: this.config.get<string>('npm_package_version', '1.0.0'),
    };
  }

  /** Readiness probe — checks DB connectivity */
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  async getReadiness(): Promise<ReadinessStatus> {
    const dbOk = await this.checkDatabase();

    return {
      status: dbOk ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: this.config.get<string>('npm_package_version', '1.0.0'),
      checks: {
        database: dbOk ? 'ok' : 'error',
      },
    };
  }

  /** Full health status */
  @Get()
  @ApiOperation({ summary: 'Full health status' })
  async getHealth(): Promise<ReadinessStatus> {
    return this.getReadiness();
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
