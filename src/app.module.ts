import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { DevConfig } from './common/providers/DevConfig';
import { UserModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module'; // New PrismaModule
import { PrismaService } from './prisma/prisma.service';

const devConfig = { port: '3000' };
const proConfig = { port: '4000' };

@Module({
  imports: [
    PrismaModule, // Replace MongooseModule with PrismaModule
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes the settings globally available in your app
      envFilePath: './config.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DevConfig,
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig.port : proConfig.port;
      },
    },
    PrismaService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('user');
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.POST });
  }
}
