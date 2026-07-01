'use strict';

const { Module } = require('@nestjs/common');
const { MongooseModule } = require('@nestjs/mongoose');
const { InvoicesController } = require('./invoices.controller');
const { InvoicesService } = require('./invoices.service');
const { InvoiceSchema } = require('./invoice.schema');

class InvoicesModule {}

Module({
  imports: [MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }])],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})(InvoicesModule);

module.exports = { InvoicesModule };
