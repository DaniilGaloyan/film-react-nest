import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const useMongo = new ConfigService().get('USE_MONGODB') === 'true';
  const app = await NestFactory.create(AppModule.register(useMongo));
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT') || '3000';
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(parseInt(port, 10));
}
bootstrap();
