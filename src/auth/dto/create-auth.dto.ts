import { PartialType, PickType } from '@nestjs/swagger';
import { CoreMutationOutput } from 'src/common/dto/core-mutation-output.dto';
import { User } from 'src/users/entities/user.entity';
import { IsString, IsEmail, IsEnum, IsOptional, MinLength, Matches, IsNotEmpty } from 'class-validator';

enum Permission {
  SUPER_ADMIN = 'Super admin',
  STORE_OWNER = 'Store owner',
  STAFF = 'Staff',
  CUSTOMER = 'Customer',
}

export class RegisterDto extends PickType(User, ['name', 'email', 'password']) {
  @IsEnum(Permission)
  @IsOptional()
  permission: Permission = Permission.CUSTOMER;
}

export class LoginDto extends PartialType(
  PickType(User, ['email', 'password']),
) {}

export class SocialLoginDto {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  newPassword: string;
}

export class ForgetPasswordDto {
  @IsEmail()
  email: string;
}

export class VerifyForgetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}

export class AuthResponse {
  @IsString()
  token: string;

  @IsString({ each: true })
  permissions: string[];

  @IsString()
  @IsOptional()
  role?: string;
}

export class CoreResponse extends CoreMutationOutput {}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  otp_id: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format',
  })
  phone_number: string;
}

export class OtpResponse {
  @IsString()
  id: string;

  @IsString()
  message: string;

  @IsNotEmpty()
  success: boolean;

  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format',
  })
  phone_number: string;

  @IsString()
  provider: string;

  @IsNotEmpty()
  is_contact_exist: boolean;
}

export class OtpDto {
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format',
  })
  phone_number: string;
}

export class OtpLoginDto {
  @IsString()
  @IsNotEmpty()
  otp_id: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format',
  })
  phone_number: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}