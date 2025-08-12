import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['user_id'];

    if (!token || token === '') {
      const user = await this.userService.createUser();

      const cookieOptions: CookieOptions | undefined =
        this.configService.get<CookieOptions>('cookies');
      console.log(cookieOptions);
      if (!cookieOptions) {
        throw new Error('Cookie options not found');
      }

      res.cookie('user_id', user.id, cookieOptions);

      res.setHeader('X-User-Id', user.id); //create a custom header for use at the first response
    }

    next();
  }
}
