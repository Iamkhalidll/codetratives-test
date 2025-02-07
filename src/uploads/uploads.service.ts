import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  HeadObjectCommand,
  ServerSideEncryption 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as mime from 'mime-types';
import { promisify } from 'util';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

export interface UploadResponse {
  key: string;
  etag: string;
  url: string;
  mimeType: string;
  size: number;
  originalName: string;
}

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);
  
  // Configurable constants
  private readonly ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]);
  
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly UPLOAD_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_FILE_NAME_LENGTH = 100;

  constructor() {
    this.validateEnvironmentVariables();
    
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      maxAttempts: 3, // Retry configuration
    });
  }

  private validateEnvironmentVariables(): void {
    const requiredEnvVars = [
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_S3_BUCKET'
    ];

    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<UploadResponse> {
    try {
      await this.validateFile(file);
      
      const sanitizedFileName = await this.generateSecureFileName(file.originalname);
      const uploadResult = await this.s3Upload(
        file.buffer,
        sanitizedFileName,
        file.mimetype,
        file.originalname
      );

      const url = await this.generatePresignedUrl(uploadResult.Key);

      return {
        key: uploadResult.Key,
        etag: uploadResult.ETag,
        url,
        mimeType: file.mimetype,
        size: file.size,
        originalName: file.originalname
      };
    } catch (error) {
      this.logger.error(`File upload failed: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to process file upload');
    }
  }

  private async validateFile(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Size validation
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`
      );
    }

    if (file.size === 0) {
      throw new BadRequestException('Empty file provided');
    }

    // MIME type validation
    if (!this.ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${Array.from(this.ALLOWED_MIME_TYPES).join(', ')}`
      );
    }

    // File extension validation
    const extension = path.extname(file.originalname).toLowerCase();
    const actualMimeType = mime.lookup(extension);
    if (!actualMimeType || !this.ALLOWED_MIME_TYPES.has(actualMimeType)) {
      throw new BadRequestException('Invalid file extension');
    }

    // Filename length validation
    if (file.originalname.length > this.MAX_FILE_NAME_LENGTH) {
      throw new BadRequestException(`Filename exceeds ${this.MAX_FILE_NAME_LENGTH} characters`);
    }

    await this.scanFileForThreats(file);
  }

  private async generateSecureFileName(originalName: string): Promise<string> {
    const fileExtension = path.extname(originalName).toLowerCase();
    const randomBytes = await promisify(crypto.randomBytes)(32); // Increased from 16 to 32 bytes
    const timestamp = Date.now();
    const hash = crypto
      .createHash('sha256')
      .update(originalName + timestamp)
      .digest('hex')
      .slice(0, 8);

    return `${randomBytes.toString('hex')}-${hash}${fileExtension}`;
  }

  private async scanFileForThreats(file: Express.Multer.File): Promise<void> {
    // Implement virus scanning integration here
    // Example with ClamAV:
    // const scanner = new NodeClam();
    // const {isInfected, virusName} = await scanner.scanBuffer(file.buffer);
    // if (isInfected) {
    //   throw new BadRequestException(`File is infected with ${virusName}`);
    // }
    this.logger.log('File scanning should be implemented here');
  }

  private async s3Upload(
    file: Buffer,
    fileName: string,
    contentType: string,
    originalName: string,
  ) {
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${fileName}`,
      Body: file,
      ContentType: contentType,
      ServerSideEncryption: ServerSideEncryption.AES256, // Fixed this line
      ContentDisposition: `attachment; filename="${encodeURIComponent(originalName)}"`,
      Metadata: {
        'original-name': originalName,
        'upload-date': new Date().toISOString(),
        'content-type': contentType,
        'file-size': file.length.toString(),
      },
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      const result = await this.s3Client.send(command);
      this.logger.log(`File uploaded successfully: ${fileName}`);
      
      return {
        Key: `uploads/${fileName}`,
        ETag: result.ETag,
        ServerSideEncryption: result.ServerSideEncryption,
      };
    } catch (error) {
      this.logger.error(`S3 upload failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  async generatePresignedUrl(key: string, expirySeconds = 3600): Promise<string> {
    try {
      // First check if file exists
      await this.s3Client.send(new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      }));

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { 
        expiresIn: expirySeconds,
      });
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL: ${error.message}`, error.stack);
      throw new BadRequestException('File not found or inaccessible');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}