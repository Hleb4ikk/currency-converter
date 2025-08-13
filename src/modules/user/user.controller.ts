import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { UserUpdateDto } from './dto/user-update.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@CurrentUserId() userId: string) {
    console.log(userId);
    return this.userService.getUserById(userId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @CurrentUserId() userId: string,
    @Body(ValidationPipe) user: UserUpdateDto,
  ) {
    return this.userService.updateUser(userId, user);
  }
}
