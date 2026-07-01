'use strict';

const { Controller, Get, Post, Body, HttpException, HttpStatus } = require('@nestjs/common');
const { ClientsService } = require('./clients.service');

class ClientsController {
  constructor(clientsService) {
    this.clientsService = clientsService;
  }

  async create(body) {
    try {
      const client = await this.clientsService.create({
        clientName: body.clientName,
        businessName: body.businessName,
        gstNumber: body.gstNumber,
        email: body.email,
        phone: body.phone,
      });
      return { message: 'Client added successfully', data: client };
    } catch (error) {
      throw new HttpException(
        { message: 'Error adding client', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return this.clientsService.findAll();
    } catch (error) {
      throw new HttpException(
        { message: 'Error fetching clients', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// Apply decorators imperatively
Controller('api/clients')(ClientsController);
Reflect.metadata('design:paramtypes', [ClientsService])(ClientsController);

Post()(ClientsController.prototype, 'create', Object.getOwnPropertyDescriptor(ClientsController.prototype, 'create'));
Body()(ClientsController.prototype, 'create', 0);

Get()(ClientsController.prototype, 'findAll', Object.getOwnPropertyDescriptor(ClientsController.prototype, 'findAll'));

module.exports = { ClientsController };
