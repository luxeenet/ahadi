import { Injectable, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import Redis from 'ioredis';

import { PrismaService } from '../../common/database/prisma.service';
import { REDIS_CLIENT } from '../../common/redis/redis.module';
import { generateId, generatePublicId, AppError, ErrorCode } from '@ahadi/shared';
import { RegisterDto, LoginDto, RequestOtpDto, VerifyOtpDto, RefreshTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  /**
   * Register a new user with phone/email and password
   */
  async register(dto: RegisterDto) {
    if (!dto.phone && !dto.email) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, 'Either phone or email must be provided', 400);
    }

    // Check uniqueness
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existingPhone) {
        throw new AppError(ErrorCode.PHONE_ALREADY_EXISTS, 'User with this phone number already exists', 409);
      }
    }
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existingEmail) {
        throw new AppError(ErrorCode.EMAIL_ALREADY_EXISTS, 'User with this email already exists', 409);
      }
    }

    const userId = generateId();
    const publicId = generatePublicId('USER');
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          id: userId,
          publicId,
          phone: dto.phone,
          email: dto.email,
          status: 'ACTIVE',
        },
      });

      await tx.userCredential.create({
        data: {
          id: generateId(),
          userId,
          passwordHash,
        },
      });

      await tx.userProfile.create({
        data: {
          id: generateId(),
          userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          displayName: `${dto.firstName} ${dto.lastName}`,
        },
      });

      await tx.trustProfile.create({
        data: {
          id: generateId(),
          entityType: 'USER',
          entityId: userId,
          reliabilityScore: 50.0,
          completionScore: 50.0,
          timelinessScore: 50.0,
          communicationScore: 50.0,
          verifiedScore: 0.0,
          overallScore: 50.0,
          scoreVersion: 'v1',
        },
      });

      return newUser;
    });

    const tokens = await this.generateTokens(user.id);
    return {
      user: {
        id: user.id,
        publicId: user.publicId,
        phone: user.phone,
        email: user.email,
        status: user.status,
      },
      ...tokens,
    };
  }

  /**
   * Login with identifier (email/phone) and password
   */
  async login(dto: LoginDto) {
    const identifier = dto.identifier || dto.email || dto.phone;
    if (!identifier) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, 'Identifier, email, or phone is required', 400);
    }

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
        deletedAt: null,
      },
      include: { credentials: true },
    });

    if (!user || !user.credentials || !user.credentials.passwordHash) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid identifier or password', 401);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError(ErrorCode.ACCOUNT_SUSPENDED, 'Account has been suspended', 403);
    }

    const isMatch = await bcrypt.compare(dto.password, user.credentials.passwordHash);
    if (!isMatch) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid identifier or password', 401);
    }

    const tokens = await this.generateTokens(user.id);
    return {
      user: {
        id: user.id,
        publicId: user.publicId,
        phone: user.phone,
        email: user.email,
        status: user.status,
      },
      ...tokens,
    };
  }

  /**
   * Request OTP code for phone/email verification or passwordless login
   */
  async requestOtp(dto: RequestOtpDto) {
    const target = dto.phone || dto.email;
    if (!target) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, 'Phone or email is required for OTP request', 400);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(code, 10);

    const redisKey = `otp:${dto.purpose}:${target}`;
    await this.redis.set(redisKey, JSON.stringify({ codeHash, attempts: 0 }), 'EX', 600);

    this.logger.log(`[DEV OTP MODE] OTP for ${target} (${dto.purpose}): ${code}`);

    return {
      message: 'OTP sent successfully',
      target,
      purpose: dto.purpose,
      expiresInSeconds: 600,
      devCode: process.env.NODE_ENV === 'development' ? code : undefined,
    };
  }

  /**
   * Verify OTP and return session / action status
   */
  async verifyOtp(dto: VerifyOtpDto) {
    const target = dto.phone || dto.email;
    if (!target) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, 'Phone or email is required for OTP verification', 400);
    }

    const redisKey = `otp:${dto.purpose}:${target}`;
    const storedDataRaw = await this.redis.get(redisKey);

    if (!storedDataRaw) {
      throw new AppError(ErrorCode.OTP_EXPIRED, 'OTP expired or not requested', 400);
    }

    const storedData = JSON.parse(storedDataRaw);
    if (storedData.attempts >= 5) {
      await this.redis.del(redisKey);
      throw new AppError(ErrorCode.OTP_MAX_ATTEMPTS, 'Maximum OTP verification attempts exceeded', 429);
    }

    const isValid = await bcrypt.compare(dto.code, storedData.codeHash);
    if (!isValid) {
      storedData.attempts += 1;
      await this.redis.set(redisKey, JSON.stringify(storedData), 'KEEPTTL');
      throw new AppError(ErrorCode.OTP_INVALID, 'Invalid OTP code', 400);
    }

    await this.redis.del(redisKey);

    let user = await this.prisma.user.findFirst({
      where: { OR: [{ phone: target }, { email: target }], deletedAt: null },
    });

    if (dto.purpose === 'VERIFY_PHONE' && user) {
      await this.prisma.user.update({ where: { id: user.id }, data: { phoneVerifiedAt: new Date() } });
    } else if (dto.purpose === 'VERIFY_EMAIL' && user) {
      await this.prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date() } });
    }

    if (!user) {
      return { verified: true, user: null, message: 'OTP verified. Proceed to register.' };
    }

    const tokens = await this.generateTokens(user.id);
    return {
      verified: true,
      user: { id: user.id, publicId: user.publicId, phone: user.phone, email: user.email },
      ...tokens,
    };
  }

  /**
   * Refresh short-lived access token using valid refresh token
   */
  async refreshToken(dto: RefreshTokenDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.refreshToken).digest('hex');
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new AppError(ErrorCode.TOKEN_INVALID, 'Invalid or expired refresh token', 401);
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return this.generateTokens(storedToken.userId);
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '15m' });
    const rawRefreshToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        id: generateId(),
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      tokenType: 'Bearer',
      expiresIn: 900,
    };
  }
}
