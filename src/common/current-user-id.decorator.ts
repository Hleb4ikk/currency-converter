import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { userIdCookieName } from 'src/constants/auth.constants';
import { RequestWithCookies } from 'src/types/Request';
import { ResponseWithLocals } from 'src/types/Response';

export const CurrentUserId = createParamDecorator(
  (data: 'user_id' = userIdCookieName, context: ExecutionContext): string => {
    const request: RequestWithCookies = context.switchToHttp().getRequest();
    const response: ResponseWithLocals = context.switchToHttp().getResponse();

    const userId: string | undefined =
      request.cookies[data] || response.locals.user_id;

    if (!userId) {
      throw new ForbiddenException('User id not found');
    }

    return userId;
  },
);
