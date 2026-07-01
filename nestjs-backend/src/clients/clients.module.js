'use strict';

const { Module } = require('@nestjs/common');
const { MongooseModule } = require('@nestjs/mongoose');
const { ClientsController } = require('./clients.controller');
const { ClientsService } = require('./clients.service');
const { ClientSchema } = require('./client.schema');

class ClientsModule {}

Module({
  imports: [MongooseModule.forFeature([{ name: 'Client', schema: ClientSchema }])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})(ClientsModule);

module.exports = { ClientsModule };
