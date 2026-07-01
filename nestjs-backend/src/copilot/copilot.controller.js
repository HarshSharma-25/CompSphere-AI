'use strict';

const { Controller, Post, Body, HttpException, HttpStatus } = require('@nestjs/common');
const { CopilotService } = require('./copilot.service');

class CopilotController {
  constructor(copilotService) {
    this.copilotService = copilotService;
  }

  async askCopilot(body) {
    try {
      const { question } = body;
      if (!question) {
        throw new HttpException({ message: 'Question is required' }, HttpStatus.BAD_REQUEST);
      }
      return this.copilotService.ask(question);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { message: 'Error in CA Copilot', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

Controller('api')(CopilotController);
Reflect.metadata('design:paramtypes', [CopilotService])(CopilotController);

const copilotDesc = Object.getOwnPropertyDescriptor(CopilotController.prototype, 'askCopilot');
Post('copilot')(CopilotController.prototype, 'askCopilot', copilotDesc);
Body()(CopilotController.prototype, 'askCopilot', 0);

module.exports = { CopilotController };
