import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './configuration/app.configuration';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { CurrenciesModule } from './modules/currencies/currencies.module';

import { CacheModule } from './modules/cache/cache.module';
import { RatesModule } from './modules/rates/rates.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CurrenciesModule,
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: [
        '.env',
        process.env.NODE_ENV === 'production'
          ? '.env.production.local'
          : '.env.development.local',
      ],
    }),
    CacheModule,
    RatesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
