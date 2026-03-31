import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { JWTPayload } from '../types';
import { AuthService } from '../auth.service';
import { TypedConfigService } from 'src/typed-config/typed-config.service';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepo: Repository<RefreshToken>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly config: TypedConfigService,
    ) {}

    async create(userId: string, expiry?: Date): Promise<string> {
        const newExpiry = expiry ?? new Date(
            Date.now() + this.config.get('REFRESH_EXPIRY')
        );

        // TypeORM: Create the instance in memory, then save to DB.
        // We use the `userId` column we exposed in the entity in the previous step.
        const token = this.refreshTokenRepo.create({
            userId,
            expiry: newExpiry,
        });

        const savedToken = await this.refreshTokenRepo.save(token);
        
        return savedToken.id;
    }

    async rotate(
        refreshId: string
    ): Promise<{ refreshId: string; jwtPayload: JWTPayload }> {
        // TypeORM: findOne with relations replaces findById + populate
        const found = await this.refreshTokenRepo.findOne({
            where: { id: refreshId },
            relations: ['user'], // Populates the user entity
        });
        
        if (!found || !this.checkValid(found)) {
            // Optional but good practice: if an invalid token is found, delete it.
            if (found) await this.invalidate(refreshId);
            throw new UnauthorizedException(`Please login again`);
        }

        // Delete the old token (rotation)
        await this.refreshTokenRepo.delete(refreshId);

        // Create the new token
        const newRefreshId = await this.create(found.user.id, found.expiry);
        
        const jwtPayload: JWTPayload = {
            userId: found.user.id,
            username: found.user.name,
            roles: found.user.roles,
        };

        return {
            refreshId: newRefreshId,
            jwtPayload
        };
    }

    async invalidate(refreshId: string): Promise<void> {
        // Note: Your original Mongoose code used `findByIdAndDelete(_id, { isValid: false })`
        // which was technically a bug (findByIdAndDelete doesn't take an update payload).
        // I'm assuming you just want to delete it from the database entirely, which is standard practice.
        await this.refreshTokenRepo.delete(refreshId);
        
        // If you actually wanted to keep it in the DB but mark it invalid, use this instead:
        // await this.refreshTokenRepo.update(refreshId, { isValid: false });
    }

    // Removed the 'async' keyword here since there are no asynchronous DB operations inside
    private checkValid(
        refreshToken: RefreshToken
    ): boolean {
        return (
            !!refreshToken &&
            refreshToken.expiry.getTime() > Date.now() &&
            refreshToken.isValid
        );
    }
}