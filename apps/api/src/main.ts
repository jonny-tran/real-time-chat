/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 8080);
  app.enableCors({
    origin: ['http://localhost:3000'], // Fe next.js
    crendentials: true,
  });
  app.use(helmet());
}
bootstrap();
