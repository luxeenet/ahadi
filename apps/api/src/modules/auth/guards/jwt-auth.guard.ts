import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppError, ErrorCode } from '@ahadi/shared';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new AppError(ErrorCode.UNAUTHORIZED, 'Invalid or missing authentication token', 401);
    }
    return user;
  }
}
