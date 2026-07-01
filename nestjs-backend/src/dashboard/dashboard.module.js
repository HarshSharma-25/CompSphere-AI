'use strict';

const { Module } = require('@nestjs/common');
const { DashboardController } = require('./dashboard.controller');
const { DashboardService } = require('./dashboard.service');
const { InvoicesModule } = require('../invoices/invoices.module');

class DashboardModule {}

Module({
  imports: [InvoicesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})(DashboardModule);

module.exports = { DashboardModule };
