import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Logger } from '@nestjs/common';
import { BoardService } from './board.service';
import { AuthUser, CurrentUser } from 'src/auth/types';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 

@Controller('boards')
// @UseGuards(JwtAuthGuard) // Protect all board routes!
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Post()
    create(@Body() createBoardDto: any, @Request() req) {
        // req.user.userId comes from your JWT payload
        return this.boardService.create(createBoardDto, req.user.userId);
    }

    @Get()
    findAll(@CurrentUser() user: AuthUser) {
        Logger.log({user})
        return this.boardService.findAllForUser(user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        return this.boardService.findOne(id, req.user.userId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBoardDto: any, @Request() req) {
        return this.boardService.update(id, updateBoardDto, req.user.userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.boardService.remove(id, req.user.userId);
    }
}