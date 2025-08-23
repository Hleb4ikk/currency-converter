import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(): Promise<User> {
    try {
      return await this.prisma.user.create({ data: {} });
    } catch {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
      });
    } catch {
      throw new InternalServerErrorException('Error getting user');
    }
  }

  async updateUser(
    userId: string,
    user: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: user,
      });
    } catch {
      throw new InternalServerErrorException('Error updating user');
    }
  }
}
