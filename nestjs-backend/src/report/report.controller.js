'use strict';

const { Controller, Get, HttpException, HttpStatus } = require('@nestjs/common');
const { ReportService } = require('./report.service');

class ReportController {
  constructor(reportService) {
    this.reportService = reportService;
  }

  async getReport() {
    try {
      return this.reportService.generateReport();
    } catch (error) {
      throw new HttpException(
        { message: 'Report generation failed', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

Controller('api')(ReportController);
Reflect.metadata('design:paramtypes', [ReportService])(ReportController);
Get('report')(ReportController.prototype, 'getReport', Object.getOwnPropertyDescriptor(ReportController.prototype, 'getReport'));

module.exports = { ReportController };
