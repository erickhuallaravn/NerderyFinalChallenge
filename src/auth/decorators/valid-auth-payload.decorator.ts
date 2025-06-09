import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.type';
import { UserType } from 'generated/prisma';

export const ValidCustomerPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user?.customerId || user?.userType !== UserType.CUSTOMER) {
      throw new BadRequestException(
        'The request does not contain valid customer payload information, generate a new token and try again.',
      );
    }

    return user;
  },
);

export const ValidManagerPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (user?.userType !== UserType.MANAGER) {
      throw new BadRequestException(
        'The request does not contain valid manager payload information, generate a new token and try again.',
      );
    }

    return user;
  },
);
