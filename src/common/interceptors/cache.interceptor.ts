import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mergeMap, of } from 'rxjs';
import { userIdCookieName } from 'src/constants/auth.constants';
import { MemoryCacheService } from 'src/modules/cache/memory-cache.service';
import { RequestWithCookies } from 'src/types/Request';
import { ResponseWithLocals } from 'src/types/Response';
import { getDataFromConfig } from 'src/utils/get-data-from-config';

//intercept method adds new value to memory cache by url and user token if user send the request.
//checks if request with the same url and user token exists in db and returns cached value.
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly memoryCacheService: MemoryCacheService,
    private readonly configService: ConfigService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request: RequestWithCookies = context.switchToHttp().getRequest();
    const response: ResponseWithLocals = context.switchToHttp().getResponse();

    const token = request.cookies[userIdCookieName] || response.locals.user_id;

    if (!token) {
      throw new ForbiddenException('User id not found');
    }

    const cacheKey = `${token}:${request.url.toUpperCase()}`;

    const cached = await this.memoryCacheService.get(cacheKey);
    if (!cached) {
      return next.handle().pipe(
        mergeMap(async (response: Record<string, any>) => {
          await this.memoryCacheService.set(
            cacheKey,
            response,
            getDataFromConfig(this.configService, 'cacheTTLs.sameRequests'),
          );
          return response;
        }),
      );
    }
    return of(cached);
  }
}
