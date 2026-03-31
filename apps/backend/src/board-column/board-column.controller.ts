import { Controller, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/types'; 
import { BoardColumnService } from './board-column.service';
import { CreateColumnDto, UpdateColumnDto } from './types/dto';

@Controller('boards/:boardId/columns')
export class BoardColumnController {
    constructor(private readonly columnService: BoardColumnService) {}

    @Post()
    async create(
        @Param('boardId') boardId: string,
        @CurrentUser() user: AuthUser,
        @Body() dto: CreateColumnDto
    ) {
        return await this.columnService.create(boardId, dto, user);
    }

    @Patch(':id')
    async update(
        @Param('boardId') boardId: string,
        @Param('id') columnId: string,
        @CurrentUser() user: AuthUser,
        @Body() dto: UpdateColumnDto
    ) {
        return await this.columnService.update(boardId, columnId, dto, user);
    }

    @Delete(':id')
    async remove(
        @Param('boardId') boardId: string,
        @Param('id') columnId: string,
        @CurrentUser() user: AuthUser
    ) {
        await this.columnService.remove(boardId, columnId, user);
    }
}