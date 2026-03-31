import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from './user.entity';
import * as argon from 'argon2';
import { Role } from 'src/auth/types/auth.types';
import { CreateBulkDto, GetAllDto, UpdateBulkDto } from './types';

class UserInfo {
    id: string;
    name: string;
    roles: Role[];
    isActive: boolean;
}

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async getAll(dto: GetAllDto): Promise<{ data: User[]; totalItems: number }> {
        const { page, limit, name } = dto;
        const skip = (page - 1) * limit;

        const whereCondition = name ? { name: ILike(`${name}%`) } : {};

        const [data, totalItems] = await this.userRepository.findAndCount({
            where: whereCondition,
            skip,
            take: limit, 
            select: ['id', 'name', 'roles', 'isActive'], 
        });

        return { data, totalItems };
    }

    async update(dto: UpdateBulkDto): Promise<void> {
        const updates = await this.prepareUpdates(dto);
        
        // Run all updates concurrently without a manual transaction block
        await Promise.all(
            updates.map(updateData => 
                this.userRepository.update({ id: updateData.id }, updateData.update)
            )
        );
    }

    private async prepareUpdates(dto: UpdateBulkDto) {
        return Promise.all(
            dto.updates.map(async ({ user, update }) => {
                const newUpdate: any = { ...update };

                if (newUpdate.password) {
                    newUpdate.passwordHash = await argon.hash(newUpdate.password);
                    delete newUpdate.password;
                }

                return { id: user, update: newUpdate }; 
            })
        );
    }

    async create(dto: CreateBulkDto): Promise<void> {
        const inserts = await Promise.all(
            dto.users.map(async (user) => ({
                name: user.name,
                passwordHash: await argon.hash(user.password),
                roles: user.roles,
            }))
        );

        // TypeORM natively handles this as a single bulk insert query
        await this.userRepository.insert(inserts);
    }

    async checkCredentials(username: string, password: string): Promise<UserInfo | null> {
        const user = await this.userRepository.findOne({
            where: { name: username },
        });
        
        if (!user) {
            return null;
        }

        const isMatch = await argon.verify(user.passwordHash, password);
        if (!isMatch) {
            return null;
        }

        return { 
            id: user.id, 
            name: user.name, 
            roles: user.roles, 
            isActive: user.isActive 
        };
    }

    async checkActivated(username: string): Promise<boolean> {
        return await this.userRepository.exists({
            where: { name: username, isActive: true },
        });
    }

    async getName(userId: string): Promise<string> {
        const found = await this.userRepository.findOne({
            where: { id: userId },
            select: ['name'],
        });

        return found?.name ?? 'N/A';
    }
}