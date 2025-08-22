import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { UserUpdateDto } from './dto/user-update.dto';
import { ApiBody } from '@nestjs/swagger';

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
  @ApiBody({
    type: UserUpdateDto,
    examples: {
      user: { value: { base_currency: 'USD', favorites: ['USD', 'EUR'] } },
    },
  })
  async updateUser(
    @CurrentUserId() userId: string,
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto,
  ) {
    return this.userService.updateUser(userId, userUpdateDto);
  }
}
