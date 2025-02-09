// src/profiles/dto/profile.dto.ts
import { IsString, IsOptional, IsBoolean, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDataDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsString()
  @IsOptional()
  avatarId?: string;

  @IsString()
  @IsOptional()
  avatarThumbnail?: string;

  @IsString()
  @IsOptional()
  avatarOriginal?: string;

  @IsEmail()
  @IsOptional()
  notificationEmail?: string;

  @IsBoolean()
  @IsOptional()
  notificationEnable?: boolean;
}

export class ProfileInputDto {
  @IsString()
  name: string;

  @Type(() => ProfileDataDto)
  profile: ProfileDataDto;
}

export class UpdateProfileDto {
  @IsString()
  id: string;

  @Type(() => ProfileInputDto)
  input: ProfileInputDto;
}