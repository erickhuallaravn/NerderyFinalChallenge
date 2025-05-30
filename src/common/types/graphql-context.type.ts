import { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

export interface GqlContext {
  req: Request & { user: JwtPayload };
}
