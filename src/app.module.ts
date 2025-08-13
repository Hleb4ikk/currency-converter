import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './configuration/app.configuration';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CurrenciesModule,
    ConfigModule.forRoot({
      load: [appConfig],
      envFilePath: ['.env.development.local', '.env.production.local'], // remove .env.dev for production
    }),
    CacheModule.register({
      ttl: 300_000,
      isGlobal: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
