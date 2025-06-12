import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override handleRequest<TUser = any>(
    err: any,
    user: JwtPayload,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const req = context
      .switchToHttp()
      .getRequest<Request & { authPayload?: JwtPayload }>();

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    req.authPayload = user;

    return user as TUser;
  }
}
