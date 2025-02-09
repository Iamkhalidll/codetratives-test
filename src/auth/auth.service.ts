import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { 
  RegisterDto, 
  LoginDto, 
  AuthResponse, 
  ChangePasswordDto, 
  SocialLoginDto, 
  OtpDto, 
  VerifyOtpDto,
  Permission
} from './dto/create-auth.dto';
import { create } from 'domain';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async generateToken(userId: number, permissions: string[]): Promise<string> {
    return this.jwtService.sign({ sub: userId, permissions });
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword, 
    }});

    const token = await this.generateToken(user.id, user.permissions);

    return {
      token,
      permissions: user.permissions,
      role: user.permissions[0],
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.password, dto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.id, user.permissions);

    return {
      token,
      permissions: user.permissions,
      role: user.permissions[0],
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user?.password) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await argon2.verify(user.password, dto.oldPassword);
    if (!isValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: await argon2.hash(dto.newPassword) },
    });

    return true;
  }

  // async socialLogin(dto: SocialLoginDto): Promise<AuthResponse> {
  //   let user = await this.prisma.user.findFirst({
  //     where: {
  //       profile: {
  //         path: ['socialProvider'],
  //         equals: dto.provider,
  //       },
  //     }
  //   });

  //   if (!user) {
  //     user = await this.prisma.user.create({
  //       data: {
  //         name: 'Social User', // Should come from provider
  //         email: 'social@example.com', // Should come from provider
  //         profile: {
  //           socialProvider: dto.provider,
  //           socialToken: dto.access_token,
  //         },
  //         permissions: [Permission.CUSTOMER],
  //       },
  //     });
  //   }

  //   const token = await this.generateToken(user.id, user.permissions);

  //   return {
  //     token,
  //     permissions: user.permissions,
  //     role: Permission.CUSTOMER,
  //   };
  // }

  async verifyOtp(dto: VerifyOtpDto): Promise<boolean> {
    const otp = await this.prisma.oTP.findFirst({
      where: {
        code: dto.code,
        phone_number: dto.phone_number,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otp) return false;

    await this.prisma.oTP.delete({ where: { id: otp.id } });
    return true;
  }

  async sendOtp(dto: OtpDto): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const otp = await this.prisma.oTP.create({
      data: {
        code,
        phone_number: dto.phone_number,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // TODO: Send SMS with code
    return otp.id;
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        shops: true,
        managed_shop: true,
        address: { where: { default: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}