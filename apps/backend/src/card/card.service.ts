import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity'; 
import { BoardService } from '../board/board.service'; 
import type { AuthUser } from '../auth/types';
import { CreateCardDto, UpdateCardDto } from './types';

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>,
        private readonly boardService: BoardService, 
    ) {}

    async get(boardId: string, cardId: string, user: AuthUser): Promise<Card> {
        const result = await this.cardRepository.findOne({
            where: {
            id: cardId}
        })

        if (!result) {
            throw new NotFoundException(`Card not found`)
        }

        return result
    }

    async create(boardId: string, columnId: string, dto: CreateCardDto, user: AuthUser): Promise<Card> {
        await this.boardService.findOne(boardId, user.userId);

        const existingCardsCount = await this.cardRepository.count({
            where: { columnId }
        });

        const card = this.cardRepository.create({
            ...dto,
            columnId,
            order: existingCardsCount
        });

        return await this.cardRepository.save(card);
    }

    async update(boardId: string, currentColumnId: string, cardId: string, dto: UpdateCardDto, user: AuthUser): Promise<Card> {
    await this.boardService.findOne(boardId, user.userId);

    const card = await this.cardRepository.findOne({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    const oldOrder = card.order;
    const newOrder = dto.order;
    const isNewColumn = dto.columnId && dto.columnId !== currentColumnId;

    if (newOrder !== undefined && (oldOrder !== newOrder || isNewColumn)) {
        
        if (isNewColumn) {
            await this.cardRepository.createQueryBuilder()
                .update()
                .set({ order: () => '"order" - 1' })
                .where('columnId = :currentColumnId AND order > :oldOrder', { currentColumnId, oldOrder })
                .execute();

            await this.cardRepository.createQueryBuilder()
                .update()
                .set({ order: () => '"order" + 1' })
                .where('columnId = :newColumnId AND order >= :newOrder', { newColumnId: dto.columnId, newOrder })
                .execute();
        } else {
            if (oldOrder < newOrder) {
                await this.cardRepository.createQueryBuilder()
                    .update()
                    .set({ order: () => '"order" - 1' })
                    .where('columnId = :currentColumnId AND order > :oldOrder AND order <= :newOrder', { currentColumnId, oldOrder, newOrder })
                    .execute();
            } else {
                await this.cardRepository.createQueryBuilder()
                    .update()
                    .set({ order: () => '"order" + 1' })
                    .where('columnId = :currentColumnId AND order >= :newOrder AND order < :oldOrder', { currentColumnId, oldOrder, newOrder })
                    .execute();
            }
        }
    }

    Object.assign(card, dto);
    return await this.cardRepository.save(card);
}

    async remove(boardId: string, columnId: string, cardId: string, user: AuthUser): Promise<void> {
        await this.boardService.findOne(boardId, user.userId);
        
        const result = await this.cardRepository.delete({ 
            id: cardId, 
            columnId 
        });

        if (result.affected === 0) {
            throw new NotFoundException('Card not found');
        }
    }
}