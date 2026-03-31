import { 
    Controller, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards 
} from '@nestjs/common';
import { CardService } from './card.service';
import { CurrentUser, type AuthUser } from '../auth/types'; // Adjust path

// You can move these DTOs to a separate card.dto.ts file
export class CreateCardDto {
    title: string;
    description?: string;
}

export class UpdateCardDto {
    title?: string;
    description?: string;
    order?: number;     // For reordering within the same column
    columnId?: string;  // CRITICAL: Allows moving the card to a completely different column!
}

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