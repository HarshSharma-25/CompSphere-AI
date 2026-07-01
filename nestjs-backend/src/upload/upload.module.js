'use strict';

const { Module } = require('@nestjs/common');
const { UploadController } = require('./upload.controller');
const { UploadService } = require('./upload.service');
const { InvoicesModule } = require('../invoices/invoices.module');

class UploadModule {}

Module({
  imports: [InvoicesModule],
  controllers: [UploadController],
  providers: [UploadService],
})(UploadModule);

module.exports = { UploadModule };
