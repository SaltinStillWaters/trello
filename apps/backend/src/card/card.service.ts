import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity'; // Adjust path
import { BoardService } from '../board/board.service'; // Adjust path
import type { AuthUser } from '../auth/types'; // Adjust path
import { CreateCardDto, UpdateCardDto } from './card.controller';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>,
        private readonly boardService: BoardService, // Security check injection!
    ) {}

    async create(boardId: string, columnId: string, dto: CreateCardDto, user: AuthUser): Promise<Card> {
        // 1. Verify board ownership
        await this.boardService.findOne(boardId, user.userId);

        // 2. Put the new card at the bottom of the list
        const existingCardsCount = await this.cardRepository.count({
            where: { columnId }
        });

        // 3. Create and save
        const card = this.cardRepository.create({
            ...dto,
            columnId,
            order: existingCardsCount // Adds to the bottom
        });

        return await this.cardRepository.save(card);
    }

    async update(boardId: string, currentColumnId: string, cardId: string, dto: UpdateCardDto, user: AuthUser): Promise<Card> {
        // 1. Verify board ownership
        await this.boardService.findOne(boardId, user.userId);

        // 2. Ensure the card actually exists in the column they say it does
        const card = await this.cardRepository.findOne({
            where: { id: cardId, columnId: currentColumnId }
        });

        if (!card) {
            throw new NotFoundException('Card not found in this column');
        }

        // 3. Apply updates. 
        // If dto.columnId is provided, this smoothly moves the card to a new column!
        Object.assign(card, dto);

        return await this.cardRepository.save(card);
    }

    async remove(boardId: string, columnId: string, cardId: string, user: AuthUser): Promise<void> {
        // 1. Verify board ownership
        await this.boardService.findOne(boardId, user.userId);

        // 2. Delete the card securely
        const result = await this.cardRepository.delete({ 
            id: cardId, 
            columnId 
        });

        if (result.affected === 0) {
            throw new NotFoundException('Card not found');
        }
    }
}