'use strict';

const { Injectable } = require('@nestjs/common');
const { InjectModel } = require('@nestjs/mongoose');
const { getModelToken } = require('@nestjs/mongoose');

class ClientsService {
  constructor(clientModel) {
    this.clientModel = clientModel;
  }

  async create(data) {
    const client = new this.clientModel(data);
    return client.save();
  }

  async findAll() {
    return this.clientModel.find().sort({ createdAt: -1 }).exec();
  }
}

// Apply NestJS DI decorators for plain JavaScript
Injectable()(ClientsService);

// Tell NestJS what to inject at constructor index 0
InjectModel('Client')(ClientsService, undefined, 0);

module.exports = { ClientsService };
