import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { PrismaClientInitializationError } from 'generated/prisma/runtime/library';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      this.logger.log('Connecting to remote database...');
      await this.$connect();
      this.logger.log('Connected to remote database.');
    } catch (e: unknown) {
      if (e instanceof PrismaClientInitializationError)
        this.logger.error('Failed connecting to db.', e.stack);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
