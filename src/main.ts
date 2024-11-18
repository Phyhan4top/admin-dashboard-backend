import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { JwtAuthMiddleware } from './common/middleware/Auth/JwtAuthMiddleware';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const prismaService = app.get(PrismaService);

  // Apply JwtAuthMiddleware globally
  app.use(new JwtAuthMiddleware(prismaService).use);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
