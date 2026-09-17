import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TrustService } from './trust.service';

@ApiTags('Trust DNA')
@Controller({ path: 'trust', version: '1' })
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Get Trust DNA profile and score breakdown for a user or business' })
  async getTrustProfile(
    @Param('entityType') entityType: 'USER' | 'BUSINESS',
    @Param('entityId') entityId: string,
  ): Promise<any> {
    return this.trustService.getTrustProfile(entityType, entityId);
  }
}
