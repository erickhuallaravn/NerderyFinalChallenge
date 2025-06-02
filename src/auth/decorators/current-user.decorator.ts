import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { GqlContext } from 'src/common/types/graphql-context.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.user;
    }
    const ctx = GqlExecutionContext.create(context);
    const gqlCtx = ctx.getContext<GqlContext>();
    return gqlCtx.req.user;
  },
);
