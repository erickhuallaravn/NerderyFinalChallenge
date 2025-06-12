/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const jwtExtractor: (req: Request) => string | null =
      ExtractJwt.fromAuthHeaderAsBearerToken();

    super({
      jwtFromRequest: jwtExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(authPayload: JwtPayload): Promise<JwtPayload> {
    if (
      !authPayload ||
      typeof authPayload.sub !== 'string' ||
      typeof authPayload.tokenVersion !== 'string' ||
      !authPayload.userType
    ) {
      throw new UnauthorizedException('JWT inválido');
    }

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: authPayload.sub },
      include: {
        userRoles: {
          select: {
            role: {
              select: {
                name: true,
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (user.tokenVersion !== authPayload.tokenVersion) {
      throw new UnauthorizedException('Token inválido o caducado');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { userId: user.id },
    });

    return {
      sub: user.id,
      customerId: customer?.id,
      userType: user.userType,
      tokenVersion: user.tokenVersion,
    };
  }
}
