import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest();
  
      const status = 
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      let message = 
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error';
  
      // Handle validation errors
      if (exception?.response?.message) {
        message = Array.isArray(exception.response.message)
          ? exception.response.message[0]
          : exception.response.message;
      }
  
      const errorResponse = {
        status: false,
        message,
        error: {
          code: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
        },
        details: exception?.response?.message || null,
      };
  
      response.status(status).json(errorResponse);
    }
  }