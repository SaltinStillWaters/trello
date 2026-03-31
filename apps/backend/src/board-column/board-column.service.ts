import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardService } from '../board/board.service';
import type { AuthUser } from '../auth/types'; 
import { BoardColumn } from './board-column.entity';
import { CreateColumnDto, UpdateColumnDto } from './types/dto';

@Injectable()
export class BoardColumnService {
    constructor(
        @InjectRepository(BoardColumn)
        private readonly columnRepository: Repository<BoardColumn>,
        private readonly boardService: BoardService, 
    ) {}

    async create(boardId: string, dto: CreateColumnDto, user: AuthUser): Promise<BoardColumn> {
        await this.boardService.findOne(boardId, user.userId);

        const existingCount = await this.columnRepository.count({
            where: { boardId }
        });

        const matched = await this.columnRepository.findOne({
            where: { boardId, name: dto.name}
        })

        if (matched) {
            throw new BadRequestException(`Column ${dto.name} already exists`)
        }

        const column = this.columnRepository.create({
            ...dto,
            boardId,
            order: existingCount,
        });

        return await this.columnRepository.save(column);
    }

    async update(boardId: string, columnId: string, dto: UpdateColumnDto, user: AuthUser): Promise<BoardColumn> {
        await this.boardService.findOne(boardId, user.userId);

        const column = await this.columnRepository.findOne({
            where: { id: columnId, boardId }
        });
        
        if (!column) {
            throw new NotFoundException('Column not found on this board');
        }

        const matched = await this.columnRepository.findOne({
            where: { boardId, name: dto.name }
        })

        if (matched) {
            throw new BadRequestException(`Column ${dto.name} already exists`)
        }
        
        Object.assign(column, dto);

        return await this.columnRepository.save(column);
    }

    async remove(boardId: string, columnId: string, user: AuthUser): Promise<void> {
        await this.boardService.findOne(boardId, user.userId);

        const result = await this.columnRepository.delete({ 
            id: columnId, 
            boardId 
        });

        if (result.affected === 0) {
            throw new NotFoundException('Column not found');
        }
    }
}