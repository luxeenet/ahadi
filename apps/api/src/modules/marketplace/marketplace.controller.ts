import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';

@ApiTags('Marketplace')
@Controller({ path: 'marketplace', version: '1' })
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('providers')
  @ApiOperation({ summary: 'Search verified service providers with auditable Trust DNA' })
  async searchProviders(
    @Query('category') category?: string,
    @Query('query') query?: string,
  ): Promise<any> {
    return this.marketplaceService.searchProviders(category, query);
  }
}
