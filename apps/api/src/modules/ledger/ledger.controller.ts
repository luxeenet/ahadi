import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LedgerService } from './ledger.service';

@ApiTags('Ledger')
@Controller({ path: 'ledger', version: '1' })
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Post('escrow')
  @ApiOperation({ summary: 'Lock milestone funds into escrow hold' })
  async createEscrowHold(@Body() body: { commitmentId: string; amount: number; currency?: string }): Promise<any> {
    return this.ledgerService.createEscrowHold(body.commitmentId, body.amount, body.currency);
  }

  @Get('balance/:entityType/:entityId')
  @ApiOperation({ summary: 'Get verified audited balance for an account or commitment' })
  async getAccountBalance(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ): Promise<any> {
    return this.ledgerService.getAccountBalance(entityType, entityId);
  }
}
