import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AHADI AI')
@Controller({ path: 'ai', version: '1' })
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('analyze/:commitmentId')
  @ApiOperation({ summary: 'Analyze commitment risk and generate audit recommendations' })
  async analyzeCommitmentRisk(@Param('commitmentId') commitmentId: string): Promise<any> {
    return this.aiService.analyzeCommitmentRisk(commitmentId);
  }
}
