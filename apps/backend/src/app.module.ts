import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestExampleModule } from './test-example/test-example.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestExample } from './test-example/test.entity';
import { TypedConfigModule } from './typed-config/typed-config.module';
import { TypedConfigService } from './typed-config/typed-config.service';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JWTAuthGuard } from './auth/guards/jwt.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { GlobalFilter } from './global.filter';
import { BoardColumnModule } from './board-column/board-column.module';
import { CardModule } from './card/card.module';

@Module({
  imports: [
    TypedConfigModule,
    TestExampleModule,
    TypeOrmModule.forRootAsync({
      imports: [TypedConfigModule],
      inject: [TypedConfigService],
      useFactory: (configService: TypedConfigService) => ({
        type: configService.get('DB_TYPE'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: configService.get('DB_SYNCHRONIZE'),
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    BoardModule,
    BoardColumnModule,
    CardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalFilter,
    },
  ],
})
export class AppModule {}
