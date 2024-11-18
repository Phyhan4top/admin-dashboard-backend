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

  // Enable CORS globally
  app.enableCors({
    origin: 'http://localhost:3001', // Frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
    credentials: true, // Allow cookies or authorization headers
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
