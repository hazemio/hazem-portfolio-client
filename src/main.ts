import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CsrfExceptionFilter } from './common/filters/csrf-exception.filter';

async function bootstrap() {
  const app    = await NestFactory.create<NestExpressApplication>(AppModule);
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) app.set('trust proxy', 1);

  app.use((helmet as any)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true } : false,
  }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me-32chars-minimum!!',
    resave: false,
    saveUninitialized: false,
    name: 'sid',
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    },
  }));

  app.use(csurf({ cookie: false }));
  app.useGlobalFilters(new CsrfExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n  🚀 API → http://localhost:${port}/api`);
  console.log(`  🍪 HttpOnly=${true} Secure=${isProd} SameSite=${isProd ? 'Strict' : 'Lax'}`);
  console.log(`  🛡️  CSRF + Helmet + Rate Limiting: Active\n`);
}
bootstrap();
