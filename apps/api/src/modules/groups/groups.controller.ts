import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller({ path: 'groups', version: '1' })
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Chama or community group pool' })
  async createGroup(@Body() body: { creatorUserId: string; name: string; type?: string; description?: string }): Promise<any> {
    return this.groupsService.createGroup(body.creatorUserId, body);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get groups for a user' })
  async getUserGroups(@Param('userId') userId: string): Promise<any> {
    return this.groupsService.getUserGroups(userId);
  }
}
