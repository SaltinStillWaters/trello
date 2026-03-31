import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JWTStrategy } from './jwt.strategy';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { CookieModule } from './cookie/cookie.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    CookieModule,
    forwardRef(() => RefreshTokenModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JWTStrategy,
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
