import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@CurrentUserId() userId: string) {
    console.log(userId);
    return this.userService.getUserById(userId);
  }
}
