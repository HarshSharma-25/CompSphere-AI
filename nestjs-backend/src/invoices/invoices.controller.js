'use strict';

const { Controller, Get, HttpException, HttpStatus } = require('@nestjs/common');
const { InvoicesService } = require('./invoices.service');

class InvoicesController {
  constructor(invoicesService) {
    this.invoicesService = invoicesService;
  }

  async findAll() {
    try {
      return this.invoicesService.findAll();
    } catch (error) {
      throw new HttpException(
        { message: 'Error fetching invoices', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// Apply decorators
Controller('api/invoices')(InvoicesController);
Reflect.metadata('design:paramtypes', [InvoicesService])(InvoicesController);
Get()(InvoicesController.prototype, 'findAll', Object.getOwnPropertyDescriptor(InvoicesController.prototype, 'findAll'));

module.exports = { InvoicesController };
