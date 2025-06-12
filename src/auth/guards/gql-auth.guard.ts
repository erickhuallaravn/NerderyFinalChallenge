import { Request } from 'express';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from '../../common/types/graphql-context.type';
import { JwtPayload } from '../types/jwt-payload.type';

interface AuthenticatedRequest extends Request {
  authPayload?: JwtPayload;
}

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  override getRequest(context: ExecutionContext): AuthenticatedRequest {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<GqlContext>().req;
  }

  override handleRequest<TUser = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext<GqlContext>().req as AuthenticatedRequest;

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    req.authPayload = user as unknown as JwtPayload;

    return user;
  }
}
