import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';

// Optional: You can move these interfaces to a separate board.dto.ts file later
export interface CreateBoardDto {
    name: string;
    description?: string;
}

export interface UpdateBoardDto {
    name?: string;
    description?: string;
}

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    async create(dto: CreateBoardDto, userId: string): Promise<Board> {
        // Create the board instance in memory, attaching the current user as the owner
        const board = this.boardRepository.create({
            ...dto,
            ownerId: userId,
        });

        // Save it to PostgreSQL
        return await this.boardRepository.save(board);
    }

    async findAllForUser(userId: string): Promise<Board[]> {
        Logger.log('HERE')
        // Fetch all boards belonging to this user, newest first
        return await this.boardRepository.find({
            where: { ownerId: userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Board> {
        // Notice we query by BOTH id and ownerId. 
        // This ensures User A cannot fetch User B's board by guessing the ID.
        const board = await this.boardRepository.findOne({
            where: { id, ownerId: userId },
        });

        if (!board) {
            throw new NotFoundException(`Board not found or you do not have access to it.`);
        }

        return board;
    }

    async update(id: string, dto: UpdateBoardDto, userId: string): Promise<Board> {
        // First, ensure the board exists and belongs to the user
        await this.findOne(id, userId);

        // Perform the update
        await this.boardRepository.update(id, dto);

        // Return the freshly updated board
        return await this.findOne(id, userId);
    }

    async remove(id: string, userId: string): Promise<void> {
        // First, ensure the board exists and belongs to the user
        await this.findOne(id, userId);

        // Delete it from the database
        await this.boardRepository.delete(id);
    }
}