import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiPropertyOptional({ example: '+255712345678', description: 'User phone number in E.164 format' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'User email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'SecureP@ssw0rd2026', description: 'User password (min 8 chars)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @ApiProperty({ example: 'Juma', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Rashidi', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;
}

export class LoginDto {
  @ApiPropertyOptional({ example: '+255712345678', description: 'Phone number or email' })
  @IsOptional()
  @IsString()
  identifier?: string;

  @ApiPropertyOptional({ example: 'user@example.com', description: 'Email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+255712345678', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'SecureP@ssw0rd2026', description: 'Password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class RequestOtpDto {
  @ApiPropertyOptional({ example: '+255712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'LOGIN', enum: ['VERIFY_PHONE', 'VERIFY_EMAIL', 'LOGIN', 'RESET_PASSWORD'] })
  @IsString()
  @IsNotEmpty()
  purpose!: 'VERIFY_PHONE' | 'VERIFY_EMAIL' | 'LOGIN' | 'RESET_PASSWORD';
}

export class VerifyOtpDto {
  @ApiPropertyOptional({ example: '+255712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'LOGIN', enum: ['VERIFY_PHONE', 'VERIFY_EMAIL', 'LOGIN', 'RESET_PASSWORD'] })
  @IsString()
  @IsNotEmpty()
  purpose!: 'VERIFY_PHONE' | 'VERIFY_EMAIL' | 'LOGIN' | 'RESET_PASSWORD';
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Opaque refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
