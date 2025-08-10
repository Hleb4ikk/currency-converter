import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    try {
      this.$connect();
    } catch (e) {
      throw new InternalServerErrorException('Database connection error');
    }
  }

  onModuleDestroy() {
    this.$disconnect();
  }
}
