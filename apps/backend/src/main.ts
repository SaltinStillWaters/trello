import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { TypedConfigService } from './typed-config/typed-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(TypedConfigService);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }))

  app.use(cookieParser(config.get('COOKIE_SECRET')));

  app.enableCors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true // if you plan to send cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
