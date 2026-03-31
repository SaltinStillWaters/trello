import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestExampleModule } from './test-example/test-example.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestExample } from './test-example/test.entity';
import { TypedConfigModule } from './typed-config/typed-config.module';
import { TypedConfigService } from './typed-config/typed-config.service';
import { AuthModule } from './auth/auth.module';

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
        autoLoadEntities: true
      })
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
