import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto, UpdateBoardDto } from './types';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    async create(dto: CreateBoardDto, userId: string): Promise<Board> {
        const matchedBoards = await this.boardRepository.findOne({
            where: { ownerId: userId, name: dto.name }
        })

        if (matchedBoards) {
            Logger.log({matchedBoards})
            throw new BadRequestException(`Board ${dto.name} already exists`)
        }

        const board = this.boardRepository.create({
            ...dto,
            ownerId: userId,
        });

        return await this.boardRepository.save(board);
    }

    async findAllForUser(userId: string): Promise<Board[]> {
        return await this.boardRepository.find({
            where: { ownerId: userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Board> {
        const board = await this.boardRepository.findOne({
            where: { id, ownerId: userId },
            relations: ['columns', 'columns.cards'], 
            order: {
                columns: {
                    order: 'ASC',
                    cards: { order: 'ASC' }
                }
            }
        });

        if (!board) throw new NotFoundException('Board not found');
        return board;
    }

    async update(id: string, dto: UpdateBoardDto, userId: string): Promise<Board> {
        await this.findOne(id, userId);

        const matchedBoard = await this.boardRepository.findOne({
            where: { ownerId: userId, name: dto.name}
        })

        if (matchedBoard && matchedBoard.id !== id) {
            throw new BadRequestException(`Board ${dto.name} already exists`)
        }
        
        await this.boardRepository.update(id, dto);

        return await this.findOne(id, userId);
    }

    async remove(id: string, userId: string): Promise<void> {
        await this.findOne(id, userId);
        await this.boardRepository.delete(id);
    }
}