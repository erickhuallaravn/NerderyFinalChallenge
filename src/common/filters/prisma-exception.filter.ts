import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError, HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.error('Exception caught:', exception);
    const contextType = host.getType<'http' | 'graphql'>();

    const handlePrismaError = (exception: PrismaClientKnownRequestError) => {
      switch (exception.code) {
        case 'P2025':
          return new NotFoundException(
            exception.meta?.cause || 'Resource was not found.',
          );
        case 'P2002':
          return new BadRequestException(
            'Duplicated unique field was provided.',
          );
        default:
          return new BadRequestException(
            'There was an error in the database, please try again.',
          );
      }
    };

    if (contextType === 'graphql') {
      if (exception instanceof PrismaClientKnownRequestError) {
        throw handlePrismaError(exception);
      }

      if (exception instanceof HttpException) {
        throw exception;
      }

      throw new InternalServerErrorException(
        'There was an internal error in the server, please try again.',
      );
    }

    // HTTP context
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = handlePrismaError(exception);
      return res.status(prismaError.getStatus()).json({
        error: {
          detail: prismaError.message,
        },
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      return res.status(status).json({
        error: {
          detail: response,
        },
      });
    }

    // Fallback for unknown errors
    return res.status(500).json({
      error: {
        detail: 'There was an internal error in the server, please try again.',
      },
    });
  }
}
