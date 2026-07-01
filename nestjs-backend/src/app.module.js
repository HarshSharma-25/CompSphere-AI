'use strict';

const { Module, Controller, Get } = require('@nestjs/common');
const { MongooseModule } = require('@nestjs/mongoose');
const { ConfigModule } = require('@nestjs/config');

// Import all feature modules
const { ClientsModule } = require('./clients/clients.module');
const { InvoicesModule } = require('./invoices/invoices.module');
const { UploadModule } = require('./upload/upload.module');
const { DashboardModule } = require('./dashboard/dashboard.module');
const { CopilotModule } = require('./copilot/copilot.module');
const { GstModule } = require('./gst/gst.module');
const { ReportModule } = require('./report/report.module');

// Root controller
class AppController {
  getHealth() {
    return {
      status: 'ok',
      message: 'CA AI Tool NestJS Backend Running Successfully ✅',
      timestamp: new Date().toISOString(),
    };
  }
}

// Apply decorators manually for JS
Object.defineProperty(AppController, 'name', { value: 'AppController' });

// Decorate controller
const controllerDecorator = Controller();
controllerDecorator(AppController);

const getDecorator = Get();
getDecorator(AppController.prototype, 'getHealth', Object.getOwnPropertyDescriptor(AppController.prototype, 'getHealth'));

// Root module
class AppModule {}

const moduleDecorator = Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ca-ai-tool',
      }),
    }),
    ClientsModule,
    InvoicesModule,
    UploadModule,
    DashboardModule,
    CopilotModule,
    GstModule,
    ReportModule,
  ],
  controllers: [AppController],
});

moduleDecorator(AppModule);

module.exports = { AppModule };
