'use strict';

const { Controller, Post, Body, HttpException, HttpStatus } = require('@nestjs/common');
const { GstService } = require('./gst.service');

class GstController {
  constructor(gstService) {
    this.gstService = gstService;
  }

  checkGst(body) {
    try {
      return this.gstService.check(body);
    } catch (error) {
      throw new HttpException(
        { message: 'GST check failed', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

Controller('api')(GstController);
Reflect.metadata('design:paramtypes', [GstService])(GstController);

const gstDesc = Object.getOwnPropertyDescriptor(GstController.prototype, 'checkGst');
Post('gst-check')(GstController.prototype, 'checkGst', gstDesc);
Body()(GstController.prototype, 'checkGst', 0);

module.exports = { GstController };
