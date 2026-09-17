import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommitmentsService, CreateCommitmentDto, TransitionStateDto } from './commitments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Commitments')
@Controller({ path: 'commitments', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommitmentsController {
  constructor(private readonly commitmentsService: CommitmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new commitment' })
  async createCommitment(@Req() req: any, @Body() dto: CreateCommitmentDto): Promise<any> {
    return this.commitmentsService.createCommitment(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get commitment details by ID or Public ID' })
  async getCommitment(@Param('id') id: string): Promise<any> {
    return this.commitmentsService.getCommitment(id);
  }

  @Post(':id/transition')
  @ApiOperation({ summary: 'Transition commitment status' })
  async transitionStatus(@Req() req: any, @Param('id') id: string, @Body() dto: TransitionStateDto): Promise<any> {
    return this.commitmentsService.transitionStatus(id, { ...dto, actorId: req.user.id });
  }
}
