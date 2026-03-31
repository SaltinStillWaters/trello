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
        private readonly config: TypedConfigService,
    ) {}

    async create(userId: string, expiry?: Date): Promise<string> {
        const newExpiry = expiry ?? new Date(
            Date.now() + this.config.get('REFRESH_EXPIRY')
        );

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
        const found = await this.refreshTokenRepo.findOne({
            where: { id: refreshId },
            relations: ['user'],
        });
        
        if (!found || !this.checkValid(found)) {
            if (found) await this.invalidate(refreshId);
            throw new UnauthorizedException(`Please login again`);
        }

        await this.refreshTokenRepo.delete(refreshId);

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
        await this.refreshTokenRepo.delete(refreshId);
    }

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