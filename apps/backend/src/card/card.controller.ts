import { 
    Controller, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
} from '@nestjs/common';
import { CardService } from './card.service';
import { CurrentUser, type AuthUser } from '../auth/types'; // Adjust path
import { CreateCardDto, UpdateCardDto } from './types';

@Controller('boards/:boardId/columns/:columnId/cards')
export class CardController {
    constructor(private readonly cardService: CardService) {}

    @Post()
    async create(
        @Param('boardId') boardId: string,
        @Param('columnId') columnId: string,
        @CurrentUser() user: AuthUser,
        @Body() dto: CreateCardDto
    ) {
        // Pass the boardId and user down so the service can verify ownership
        return await this.cardService.create(boardId, columnId, dto, user);
    }

    @Patch(':id')
    async update(
        @Param('boardId') boardId: string,
        @Param('columnId') currentColumnId: string,
        @Param('id') cardId: string,
        @CurrentUser() user: AuthUser,
        @Body() dto: UpdateCardDto
    ) {
        return await this.cardService.update(boardId, currentColumnId, cardId, dto, user);
    }

    @Delete(':id')
    async remove(
        @Param('boardId') boardId: string,
        @Param('columnId') columnId: string,
        @Param('id') cardId: string,
        @CurrentUser() user: AuthUser
    ) {
        await this.cardService.remove(boardId, columnId, cardId, user);
        return { success: true };
    }
}