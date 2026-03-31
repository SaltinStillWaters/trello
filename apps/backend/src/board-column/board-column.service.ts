import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardService } from '../board/board.service'; // Adjust path
import type { AuthUser } from '../auth/types'; // Adjust path
import { CreateColumnDto, UpdateColumnDto } from './board-column.controller';
import { BoardColumn } from './board-column.entity';

@Injectable()
export class BoardColumnService {
    constructor(
        @InjectRepository(BoardColumn)
        private readonly columnRepository: Repository<BoardColumn>,
        private readonly boardService: BoardService, // Injecting this for security checks!
    ) {}

    async create(boardId: string, dto: CreateColumnDto, user: AuthUser): Promise<BoardColumn> {
        // 1. Verify the board exists AND the user owns it. 
        // If they don't, this throws a NotFoundException automatically.
        await this.boardService.findOne(boardId, user.userId);

        // 2. Figure out the order for the new column (put it at the far right)
        // A simple way for MVP is just to count the existing columns.
        const existingCount = await this.columnRepository.count({
            where: { boardId }
        });

        // 3. Create and save the column
        const column = this.columnRepository.create({
            ...dto,
            boardId,
            order: existingCount, // e.g., if there are 3 columns, the new one is index 3
        });

        return await this.columnRepository.save(column);
    }

    async update(boardId: string, columnId: string, dto: UpdateColumnDto, user: AuthUser): Promise<BoardColumn> {
        // 1. Security check
        await this.boardService.findOne(boardId, user.userId);

        // 2. Find the column to ensure it exists and actually belongs to this specific board
        const column = await this.columnRepository.findOne({
            where: { id: columnId, boardId }
        });

        if (!column) {
            throw new NotFoundException('Column not found on this board');
        }

        // 3. Apply updates. (Note: True drag-and-drop reordering requires shifting 
        // the order of *other* columns too, but for an MVP, updating just this one is a great start).
        Object.assign(column, dto);

        return await this.columnRepository.save(column);
    }

    async remove(boardId: string, columnId: string, user: AuthUser): Promise<void> {
        // 1. Security check
        await this.boardService.findOne(boardId, user.userId);

        // 2. Delete the column (ensuring it belongs to this board)
        const result = await this.columnRepository.delete({ 
            id: columnId, 
            boardId 
        });

        if (result.affected === 0) {
            throw new NotFoundException('Column not found');
        }
    }
}