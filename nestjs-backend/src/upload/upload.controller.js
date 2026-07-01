'use strict';

const {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} = require('@nestjs/common');
const { FileInterceptor } = require('@nestjs/platform-express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { UploadService } = require('./upload.service');

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

class UploadController {
  constructor(uploadService) {
    this.uploadService = uploadService;
  }

  async uploadFile(file) {
    try {
      if (!file) {
        throw new HttpException({ message: 'No file uploaded' }, HttpStatus.BAD_REQUEST);
      }
      return this.uploadService.processFile(file);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { message: 'Error while processing document', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

// Apply decorators
Controller('api')(UploadController);
Reflect.metadata('design:paramtypes', [UploadService])(UploadController);

const uploadDesc = Object.getOwnPropertyDescriptor(UploadController.prototype, 'uploadFile');
Post('upload')(UploadController.prototype, 'uploadFile', uploadDesc);
UseInterceptors(FileInterceptor('document', { storage }))(UploadController.prototype, 'uploadFile', uploadDesc);
UploadedFile()(UploadController.prototype, 'uploadFile', 0);

module.exports = { UploadController };
