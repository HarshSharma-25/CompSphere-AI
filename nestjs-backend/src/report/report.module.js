'use strict';

const { Module } = require('@nestjs/common');
const { ReportController } = require('./report.controller');
const { ReportService } = require('./report.service');
const { InvoicesModule } = require('../invoices/invoices.module');

class ReportModule {}

Module({
  imports: [InvoicesModule],
  controllers: [ReportController],
  providers: [ReportService],
})(ReportModule);

module.exports = { ReportModule };
