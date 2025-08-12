import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: 'user_id' = 'user_id', context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userId = request.cookies[data] || response.getHeader('X-User-Id');

    if (!userId) {
      throw new ForbiddenException('User id not found');
    }

    return userId;
  },
);
