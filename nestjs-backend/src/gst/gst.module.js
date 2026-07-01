'use strict';

const { Module } = require('@nestjs/common');
const { GstController } = require('./gst.controller');
const { GstService } = require('./gst.service');

class GstModule {}

Module({
  controllers: [GstController],
  providers: [GstService],
})(GstModule);

module.exports = { GstModule };
