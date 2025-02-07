// upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './uploads.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post("file")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.size)
    const result = await this.s3Service.uploadFile(file);
    const downloadUrl = await this.s3Service.generatePresignedUrl(result.key);
    
    return {
      message: 'File uploaded successfully',
      fileUrl: downloadUrl,
      key: result.key,
    };
  }
}