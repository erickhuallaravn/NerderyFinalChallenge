import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('Unhandled Exception:', exception);
    const contextType = host.getType<'http' | 'graphql'>();

    if (contextType === 'graphql') {
      GqlArgumentsHost.create(host);

      if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        if (exception.code === 'P2025') {
          throw new HttpException('Resource was not found.', 404);
        }

        if (exception.code === 'P2002') {
          throw new HttpException('Duplicated unique field was provided.', 400);
        }

        throw new HttpException(
          'There was an error in the database, please try again.',
          400,
        );
      }

      if (exception instanceof HttpException) {
        throw exception;
      }

      throw new HttpException(
        'There was an internal error in the server, please try again.',
        500,
      );
    }

    // Default HTTP context handling
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025') {
        const cause: string =
          (exception.meta?.cause as string) ?? 'Resource was not found.';
        return response.status(404).json({
          error: { detail: cause },
        });
      }

      if (exception.code === 'P2002') {
        return response.status(400).json({
          error: { detail: 'Duplicated unique field was provided.' },
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
        error: { detail: message },
      });
    }
    return response.status(500).json({
      error: {
        detail: 'There was an internal error in the server, please try again.',
      },
    });
  }
}
