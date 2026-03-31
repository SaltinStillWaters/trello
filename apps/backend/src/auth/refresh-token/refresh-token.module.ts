import { forwardRef, Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { AuthModule } from '../auth.module';
import { RefreshToken } from './refresh-token.entity';
import { CookieModule } from '../cookie/cookie.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    forwardRef(() => AuthModule), 
    CookieModule
  ],
  providers: [
    RefreshTokenService,
  ],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule {}
