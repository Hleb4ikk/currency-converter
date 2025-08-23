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
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { userApiMetadata } from './metadata/user-api.metadata';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse(userApiMetadata.handlers.getUser.responses.ok)
  @ApiInternalServerErrorResponse(
    userApiMetadata.handlers.getUser.responses.internalServerError,
  )
  @ApiOperation(userApiMetadata.handlers.getUser.operation)
  async getUser(@CurrentUserId() userId: string) {
    console.log(userId);
    return this.userService.getUserById(userId);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation(userApiMetadata.handlers.updateUser.operation)
  @ApiBody(userApiMetadata.handlers.updateUser.requestBody)
  @ApiOkResponse(userApiMetadata.handlers.updateUser.responses.ok)
  @ApiInternalServerErrorResponse(
    userApiMetadata.handlers.updateUser.responses.internalServerError,
  )
  async updateUser(
    @CurrentUserId() userId: string,
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto,
  ) {
    return this.userService.updateUser(userId, userUpdateDto);
  }
}
