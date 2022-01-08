import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.SERVER_PORT);
  console.log(`Started on port ${process.env.SERVER_PORT}`)
}
bootstrap();
