/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: { target: false, value: false },
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
  app.enableCors({
    origin: ['http://localhost:3000'], // Fe next.js
    crendentials: true,
  });
  app.use(helmet());
}
bootstrap();
