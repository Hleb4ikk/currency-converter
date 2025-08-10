import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/modules/user/user.service';

export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['user_id'];
    if (!token) {
      const user = await this.userService.createUser({});
      res.cookie('user_id', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24,
        path: '/',
      });
    }
    next();
  }
}
