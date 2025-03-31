import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  // CORS 활성화
  app.enableCors({
    origin: [
      'http://localhost:8081',
      'http://192.168.45.121:8081',
      'exp://192.168.45.121:8081',
      'exp://localhost:8081',
      'exp://127.0.0.1:8081',
      'exp://*',
      'http://*',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
  });

  // 전역 파이프 설정
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
