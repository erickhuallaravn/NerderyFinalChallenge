import { UserType } from 'src/shared/enums';

export type JwtPayload = {
  sub: string;
  customerId: string;
  userType: UserType;
  tokenVersion: string;
};
