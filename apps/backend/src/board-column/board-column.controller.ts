import { 
    Controller, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards, 
    Logger
} from '@nestjs/common';
import { CurrentUser, type AuthUser } from '../auth/types'; // Adjust path
import { BoardColumnService } from './board-column.service';
import { IsNotEmpty, IsString } from 'class-validator';

// Define your DTOs (You can move these to a separate column.dto.ts file)
export class CreateColumnDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateColumnDto {
    name?: string;
    order?: number; // Crucial for drag-and-drop later!
}

@Controller('boards/:boardId/columns')
export class BoardColumnController {
    constructor(private readonly columnService: BoardColumnService) {}

    @Post()
    async create(
        @Param('boardId') boardId: string,
        @CurrentUser() user: AuthUser,
        @Body() dto: CreateColumnDto
    ) {

        Logger.log({boardId, user, ...dto})
        // We pass the user to the service to ensure they actually own the board
        // before allowing them to add a column to it!
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
        return { success: true };
    }
}