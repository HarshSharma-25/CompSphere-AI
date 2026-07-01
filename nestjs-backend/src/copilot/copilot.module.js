'use strict';

const { Module } = require('@nestjs/common');
const { CopilotController } = require('./copilot.controller');
const { CopilotService } = require('./copilot.service');
const { InvoicesModule } = require('../invoices/invoices.module');

class CopilotModule {}

Module({
  imports: [InvoicesModule],
  controllers: [CopilotController],
  providers: [CopilotService],
})(CopilotModule);

module.exports = { CopilotModule };
