import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, NextFunction } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { RequestWithCookies } from 'src/types/Request';
import { ResponseWithLocals } from 'src/types/Response';
import { getDataFromConfig } from 'src/utils/get-data-from-config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  async use(
    req: RequestWithCookies,
    res: ResponseWithLocals,
    next: NextFunction,
  ) {
    const token = req.cookies['user_id'];

    if (!token || token === '') {
      const user = await this.userService.createUser();

      const cookieOptions = getDataFromConfig<CookieOptions>(
        this.configService,
        'cookies',
      );

      res.cookie('user_id', user.id, cookieOptions);

      res.locals.user_id = user.id; //create a local for use at the first response
    }

    next();
  }
}
