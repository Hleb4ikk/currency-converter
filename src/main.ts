import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(AuthMiddleware);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
