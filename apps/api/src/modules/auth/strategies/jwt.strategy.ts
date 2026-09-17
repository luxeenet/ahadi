import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../../common/database/prisma.service';
import { AppError, ErrorCode } from '@ahadi/shared';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret-key-change-in-production',
    });
  }

  async validate(payload: { sub: string }): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null },
      include: { profile: true },
    });

    if (!user) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'User no longer exists', 401);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError(ErrorCode.ACCOUNT_SUSPENDED, 'User account is suspended', 403);
    }

    return {
      id: user.id,
      publicId: user.publicId,
      phone: user.phone,
      email: user.email,
      status: user.status,
      profile: user.profile,
    };
  }
}
