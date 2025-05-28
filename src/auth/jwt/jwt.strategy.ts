import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: payload.sub },
      include: {
        user_roles: {
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
    if (!user || user.token_version !== payload.token_version) {
      throw new UnauthorizedException('Token inválido o caducado');
    }

    const roles = user.user_roles.map((ur) => ur.role.name);
    const permissions = user.user_roles.flatMap((ur) => ur.role.permissions);

    return {
      sub: user.user_id,
      email: user.email,
      user_type: user.user_type,
      status: user.status,
      roles,
      permissions,
      token_version: user.token_version,
    };
  }
}
