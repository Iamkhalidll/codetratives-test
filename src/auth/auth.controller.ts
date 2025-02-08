import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Serialize } from '../common/interceptors/serialize.interceptor';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { GetUser } from './decorators/get-user.decorator';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  OtpDto,
  VerifyOtpDto,
  SocialLoginDto
} from './dto/create-auth.dto';
import { AuthResponseDto } from './dto/response/auth-response';
import { UserResponseDto } from './dto/response/user-response';
import { OtpResponseDto } from './dto/response/otp-response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ type: AuthResponseDto })
  @Serialize(AuthResponseDto)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ type: AuthResponseDto })
  @Serialize(AuthResponseDto)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @Post('social-login')
  // @ApiOperation({ summary: 'Social login' })
  // @ApiResponse({ type: AuthResponseDto })
  // @Serialize(AuthResponseDto)
  // async socialLogin(@Body() dto: SocialLoginDto) {
  //   return this.authService.socialLogin(dto);
  // }

  // @Post('change-password')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Change password' })
  // @ApiResponse({ type: Boolean })
  // async changePassword(
  //   @GetUser('id') userId: number,
  //   @Body() dto: ChangePasswordDto,
  // ) {
  //   return this.authService.changePassword(userId, dto);
  // }

  @Post('otp')
  @ApiOperation({ summary: 'Send OTP' })
  @ApiResponse({ type: OtpResponseDto })
  @Serialize(OtpResponseDto)
  async sendOtp(@Body() dto: OtpDto) {
    const id = await this.authService.sendOtp(dto);
    return { id, phone_number: dto.phone_number, verified: false };
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ type: Boolean })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  // @Get('me')
  // @UseGuards(JwtAuthGuard)
  // @ApiOperation({ summary: 'Get current user' })
  // @ApiResponse({ type: UserResponseDto })
  // @Serialize(UserResponseDto)
  // async me(@GetUser('id') userId: number) {
  //   return this.authService.me(userId);
  // }
}