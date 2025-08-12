import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request: Request = context.switchToHttp().getRequest();
    console.log(request.headers);
    return next.handle();
  }
}
