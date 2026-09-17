import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService, CreateBusinessDto } from './businesses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Businesses')
@Controller({ path: 'businesses', version: '1' })
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new business profile' })
  async createBusiness(@Req() req: any, @Body() dto: CreateBusinessDto): Promise<any> {
    return this.businessesService.createBusiness(req.user.id, dto);
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get business details by ID or Slug' })
  async getBusiness(@Param('idOrSlug') idOrSlug: string): Promise<any> {
    return this.businessesService.getBusiness(idOrSlug);
  }
}
