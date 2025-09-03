import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, NextFunction } from 'express';
import { userIdCookieName } from 'src/constants/auth.constants';
import { UserService } from 'src/modules/user/user.service';
import { RequestWithCookies } from 'src/types/Request';
import { ResponseWithLocals } from 'src/types/Response';
import { getDataFromConfig } from 'src/utils/get-data-from-config';

// Creates new users. If this is first request, user token will send in local property in response.
// Adds Set-Cookie header, if user this is first request.
// If user is in cookies header, but not exists in db, invalid user_id will delete from cookies.

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
    let token = req.cookies[userIdCookieName];

    if (token) {
      const user = await this.userService.getUserById(token);

      if (!user) {
        token = '';
      }
    }

    if (!token || token === '') {
      //check if token exists in cookies
      const user = await this.userService.createUser();

      const cookieOptions = getDataFromConfig<CookieOptions>(
        this.configService,
        'cookies',
      );

      res.cookie(userIdCookieName, user.id, cookieOptions);

      res.locals.user_id = user.id; //create a local for use at the first response
    }

    next();
  }
}
