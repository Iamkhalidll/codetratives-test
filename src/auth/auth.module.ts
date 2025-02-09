import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
      },
    }),
    PrismaModule,],
  controllers: [AuthController],
  providers: [
    AuthService,
JwtStrategy
  ],
  exports: [AuthService,],
})
export class AuthModule {}