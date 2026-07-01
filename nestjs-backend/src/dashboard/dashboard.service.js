'use strict';

const { Injectable } = require('@nestjs/common');
const { InvoicesService } = require('../invoices/invoices.service');

class DashboardService {
  constructor(invoicesService) {
    this.invoicesService = invoicesService;
  }

  async getStats() {
    return this.invoicesService.getDashboardStats();
  }
}

Injectable()(DashboardService);
Reflect.metadata('design:paramtypes', [InvoicesService])(DashboardService);

module.exports = { DashboardService };
