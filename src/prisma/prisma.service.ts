import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {try {
    await this.$connect();
    console.log('Prisma connected successfully');
  } catch (err) {
    console.error('Failed to connect to Prisma:', err);
  }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
