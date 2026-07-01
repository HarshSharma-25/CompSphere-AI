'use strict';

const { Controller, Get } = require('@nestjs/common');

class AppController {
  getHealth() {
    return { message: 'CA AI Tool NestJS Backend Running Successfully ✅' };
  }
}

AppController.decorators = [{ type: Controller }];
AppController.prototype.getHealth.decorators = [{ type: Get }];

module.exports = { AppController };
