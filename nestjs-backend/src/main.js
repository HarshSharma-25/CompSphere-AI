'use strict';

require('dotenv').config();
require('reflect-metadata');

const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');

async function bootstrap() {
  // Dynamically require after reflect-metadata is loaded
  const { AppModule } = require('./app.module');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`\n🚀 CA AI Tool NestJS Backend is running!`);
  console.log(`📡 API Base URL: http://localhost:${port}`);
  console.log(`🌐 Health Check: http://localhost:${port}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`  GET  / ...................... Health check`);
  console.log(`  POST /api/clients ........... Create client`);
  console.log(`  GET  /api/clients ........... List clients`);
  console.log(`  GET  /api/invoices .......... List invoices`);
  console.log(`  POST /api/upload ............ Upload & analyze document`);
  console.log(`  GET  /api/dashboard ......... Dashboard stats`);
  console.log(`  POST /api/copilot ........... AI Copilot Q&A`);
  console.log(`  POST /api/gst-check ......... GST compliance check`);
  console.log(`  GET  /api/report ............ Generate AI report\n`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
