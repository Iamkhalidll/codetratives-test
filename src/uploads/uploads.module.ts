// src/uploads/uploads.module.ts
import { Module } from '@nestjs/common';
import { UploadController } from './uploads.controller';
import { S3Service } from './uploads.service';

@Module({
  controllers: [UploadController],
  providers: [S3Service],
  exports: [S3Service],
})
export class UploadsModule {}