import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlContext } from 'src/common/types/graphql-context.type';
import { Request, Response } from 'express';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext): {
    req: Request;
    res: Response;
  } {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext<GqlContext>();
    return { req: ctx.req, res: ctx.res };
  }
}
