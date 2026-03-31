import { Body, Controller, Get, Logger, Patch, Post, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateBulkDto, GetAllDto, UpdateBulkDto } from './types/user.dto';
import { Roles } from 'src/auth/auth.decorator';
import { CurrentUser, Role } from 'src/auth/types';
import type { AuthUser } from 'src/auth/types';

@Roles(Role.User)
@Controller('users')
export class UserController {
    constructor(
        private service: UserService,
    ) 
    {}

    @Get('/profile')
    getProfile(@CurrentUser() user: AuthUser) {
        return {
            username: user.username,
            roles: user.roles
        }
    }

    @Get()
    async getAll(@Query() dto: GetAllDto) {
        const data = await this.service.getAll(dto);

        return data;
    }

    @Patch()
    async update(
        @Body() dto: UpdateBulkDto
    ) {
        await this.service.update(dto);
    }

    @Post()
    async create(@Body() dto: CreateBulkDto) {
        await this.service.create(dto);
    }
}
