import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { GqlContext } from 'src/common/types/graphql-context.type';
import { Request } from 'express';

type AuthenticatedRequest = Request & { authPayload?: JwtPayload };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload | undefined => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
      return request.authPayload;
    }

    const gqlCtx = GqlExecutionContext.create(context).getContext<GqlContext>();
    return gqlCtx.req.authPayload;
  },
);
