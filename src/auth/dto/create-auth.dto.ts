import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional, MinLength, Matches, IsNotEmpty } from 'class-validator';

export enum Permission {
  SUPER_ADMIN = 'Super admin',
  STORE_OWNER = 'Store owner',
  STAFF = 'Staff',
  CUSTOMER = 'Customer',
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({ enum: Permission })
  @IsOptional()
  permissions: Permission[] = [Permission.CUSTOMER];
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class SocialLoginDto {
  @ApiProperty({ enum: ['google', 'facebook', 'apple'] })
  @IsString()
  provider: string;

  @ApiProperty()
  @IsString()
  access_token: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  newPassword: string;
}

export class OtpDto {
  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone_number: string;
}

export class VerifyOtpDto extends OtpDto {
  @ApiProperty()
  @IsString()
  code: string;
}

export class OtpLoginDto extends VerifyOtpDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class AuthResponse {
  token: string;
  permissions: string[];
  role?: string;
}