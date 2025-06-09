import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //const request = ctx.getRequest<Request>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        const cause: string =
          (exception.meta?.cause as string) ?? 'Resource was not found.';
        return response.status(404).json({
          error: {
            detail: cause,
          },
        });
      }

      if (exception.code === 'P2002') {
        return response.status(400).json({
          error: {
            detail: 'Duplicated unique field was provided.',
          },
        });
      }

      return response.status(400).json({
        error: {
          detail: 'There was an error in the database, please try again.',
        },
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      return response.status(status).json({
        //timestamp: new Date().toISOString(),
        error: {
          detail: message,
        },
      });
    }

    return response.status(500).json({
      //path: request.url,
      error: {
        detail: 'There was an internal error in the server, please try again.',
      },
    });
  }
}
