import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthMiddleware } from 'src/common/middleware/Auth/JwtAuthMiddleware';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware) // Apply JwtAuthMiddleware to specific routes
      .forRoutes(UserController); // Apply it to the routes in the UserController (e.g., POST, PATCH, DELETE)
  }
}
