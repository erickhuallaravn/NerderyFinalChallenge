import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';
import { UserType } from '@prisma/client';
import { Request } from 'express';

type AuthenticatedRequest = Request & { user?: JwtPayload };

export const ValidCustomerPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || !user.customerId || user.userType !== UserType.CUSTOMER) {
      throw new BadRequestException(
        'The request does not contain valid customer payload information. Generate a new token and try again.',
      );
    }

    return user;
  },
);

export const ValidManagerPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user || user.userType !== UserType.MANAGER) {
      throw new BadRequestException(
        'The request does not contain valid manager payload information. Generate a new token and try again.',
      );
    }

    return user;
  },
);
