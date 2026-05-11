import '../src/env';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import { buildCorsOptions } from '../src/cors';

const server = express();

let bootstrapPromise: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors(buildCorsOptions());
  await app.init();
}

export default async function handler(
  request: express.Request,
  response: express.Response,
) {
  bootstrapPromise ??= bootstrap();
  await bootstrapPromise;

  return server(request, response);
}
