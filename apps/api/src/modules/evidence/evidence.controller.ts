import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EvidenceService, SubmitEvidenceDto } from './evidence.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Evidence')
@Controller({ path: 'evidence', version: '1' })
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit cryptographic evidence for a commitment or milestone' })
  async submitEvidence(@Req() req: any, @Body() dto: SubmitEvidenceDto): Promise<any> {
    return this.evidenceService.submitEvidence(req.user.id, dto);
  }

  @Get('commitment/:commitmentId')
  @ApiOperation({ summary: 'List evidence for a specific commitment' })
  async listEvidence(@Param('commitmentId') commitmentId: string): Promise<any> {
    return this.evidenceService.listEvidence(commitmentId);
  }
}
