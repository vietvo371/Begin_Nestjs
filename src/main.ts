import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
   // Serve static files
   app.useGlobalPipes(new ValidationPipe());
   app.enableCors();
   
   app.useStaticAssets(join(__dirname, '..', 'public'));
   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
     prefix: '/uploads/',
   });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
