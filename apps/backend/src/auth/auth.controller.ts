import { BadRequestException, Body, Controller, Get, Logger, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { LoginDto, Role } from './types';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public, Roles } from './auth.decorator';
import { JwtService } from '@nestjs/jwt';
import { CookieService } from './cookie/cookie.service';
import { TypedConfigService } from 'src/typed-config/typed-config.service';

@Controller('auth')
export class AuthController {
    constructor(
        private service: AuthService,
        private cookieService: CookieService,
        private jwtService: JwtService,
        private config: TypedConfigService
    ) {}
    
    @Public()
    @Roles(Role.Unauthenticated)
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { refreshPayload, jwtPayload, user } = await this.service.login(dto);
        
        this.cookieService.createJwt(res, jwtPayload);
        this.cookieService.createRefresh(res, refreshPayload)
        Logger.log({jwtPayload})
        return {user};
    }
    
    @Public()
    @Roles(Role.Unauthenticated)
    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({passthrough: true}) res: Response
    ) {
        Logger.log('REFRESH')
        const oldRefreshPayload = req.signedCookies['refresh']
        
        Logger.log('BEFORE TRY')
        try {
            const { refreshId } = JSON.parse(oldRefreshPayload)

            Logger.log({refreshId})
            if (!refreshId) throw new Error()

            const {refreshPayload, jwtPayload} = await this.service.refresh(refreshId)
            this.cookieService.createRefresh(res, refreshPayload)
            this.cookieService.createJwt(res, jwtPayload)
        } catch (err) {
            Logger.error(err)
            throw new UnauthorizedException('Please log in again')
        }
    }

    @Public()
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ) {
        const refreshPayload = req.signedCookies['refresh'];
        Logger.log({refreshPayload})
        try {
            const { refreshId } = JSON.parse(refreshPayload)
            if (!refreshId) throw new Error()

            await this.service.logout(refreshId)
        } catch (err) {
            Logger.warn('refreshPayload does not have valid content');
        }

        this.cookieService.removeJwt(res);
        this.cookieService.removeRefresh(res);
    }
}
