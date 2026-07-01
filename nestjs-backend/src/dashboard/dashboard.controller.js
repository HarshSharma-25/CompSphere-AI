'use strict';

const { Controller, Get, HttpException, HttpStatus } = require('@nestjs/common');
const { DashboardService } = require('./dashboard.service');

class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }

  async getDashboard() {
    try {
      return this.dashboardService.getStats();
    } catch (error) {
      throw new HttpException(
        { message: 'Error fetching dashboard data', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

Controller('api')(DashboardController);
Reflect.metadata('design:paramtypes', [DashboardService])(DashboardController);
Get('dashboard')(DashboardController.prototype, 'getDashboard', Object.getOwnPropertyDescriptor(DashboardController.prototype, 'getDashboard'));

module.exports = { DashboardController };
