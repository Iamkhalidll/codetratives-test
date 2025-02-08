import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface ResponseFormat<T> {
    status: boolean;
    data: T;
    message: string;
    meta?: {
      timestamp: string;
      path: string;
      statusCode: number;
    };
  }
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest();
      const statusCode = context.switchToHttp().getResponse().statusCode;
  
      return next.handle().pipe(
        map(data => ({
          status: true,
          data,
          message: 'Success',
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
            statusCode,
          },
        })),
      );
    }
  }