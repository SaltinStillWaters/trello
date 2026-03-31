import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Logger } from '@nestjs/common';
import { BoardService } from './board.service';
import { AuthUser, CurrentUser } from 'src/auth/types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateBoardDto, UpdateBoardDto } from './types';


@Controller('boards')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post()
    create(@Body() dto: CreateBoardDto, @CurrentUser() user: AuthUser) {
        return this.boardService.create(dto, user.userId);
    }

    @Get()
    findAll(@CurrentUser() user: AuthUser) {
        return this.boardService.findAllForUser(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
        return this.boardService.findOne(id, user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateBoardDto, @CurrentUser() user: AuthUser) {
        return this.boardService.update(id, dto, user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
        return this.boardService.remove(id, user.userId);
    }
}