import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from '../types/jwt-payload.type';
import { UserType } from '@prisma/client';
import { Request } from 'express';
import { GqlContext } from 'src/common/types/graphql-context.type';

type AuthenticatedRequest = Request & { authPayload?: JwtPayload };

function extractUser(ctx: ExecutionContext): JwtPayload | undefined {
  if (ctx.getType() === 'http') {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.authPayload;
  }

  const gqlCtx = GqlExecutionContext.create(ctx).getContext<GqlContext>();
  return gqlCtx.req.authPayload;
}

export const ValidCustomerPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const authPayload = extractUser(ctx);
    if (
      !authPayload ||
      !authPayload.customerId ||
      authPayload.userType !== UserType.CUSTOMER
    ) {
      throw new BadRequestException(
        'The request does not contain valid customer payload information. Generate a new token and try again.',
      );
    }

    return authPayload;
  },
);

export const ValidManagerPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const authPayload = extractUser(ctx);

    if (!authPayload || authPayload.userType !== UserType.MANAGER) {
      throw new BadRequestException(
        'The request does not contain valid manager payload information. Generate a new token and try again.',
      );
    }

    return authPayload;
  },
);
