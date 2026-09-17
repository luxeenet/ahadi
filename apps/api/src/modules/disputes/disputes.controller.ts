import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';

@ApiTags('Disputes')
@Controller({ path: 'disputes', version: '1' })
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Raise a dispute on a commitment with evidence' })
  async createDispute(@Body() body: { userId: string; commitmentId: string; reason: string }): Promise<any> {
    return this.disputesService.createDispute(body.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List active or historic disputes' })
  async getDisputes(@Query('commitmentId') commitmentId?: string): Promise<any> {
    return this.disputesService.getDisputes(commitmentId);
  }
}
