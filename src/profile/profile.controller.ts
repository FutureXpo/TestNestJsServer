import { Get, Post, Delete, Param, Controller } from '@nestjs/common';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { ProfileRO } from './profile.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth, ApiResponse, ApiTags, ApiOperation
} from '@nestjs/swagger';

const { profile_schema } = require( '../user/schemas');

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}
  
  @ApiOperation({ summary: 'Get profile of the user' })
  @ApiResponse({ status: 200, description: 'Profile was returned', schema: profile_schema })
  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return await this.profileService.findProfile(username);
  }

}