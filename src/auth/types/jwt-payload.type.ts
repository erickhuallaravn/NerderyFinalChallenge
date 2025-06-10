import { UserType } from 'src/shared/enums';

export type JwtPayload = {
  sub: string;
  customerId?: string | null;
  userType: UserType;
  tokenVersion: string;
};

declare module 'express-serve-static-core' {
  interface Request {
    authPayload?: JwtPayload;
  }
}
