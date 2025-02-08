import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Permission } from '../create-auth.dto';

class ProfileDto {
  @Expose()
  @ApiProperty()
  notifications: {
    email: boolean;
    push: boolean;
  };

  @Expose()
  @ApiProperty({ required: false })
  socialProvider?: string;
}

class AddressDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  default: boolean;

  @Expose()
  @ApiProperty()
  address: string;
}

class ShopDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  slug: string;
}

export class UserResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty({ enum: Permission, isArray: true })
  permissions: Permission[];

  @Expose()
  @ApiProperty({ type: ProfileDto })
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @Expose()
  @ApiProperty({ type: [ShopDto] })
  @Type(() => ShopDto)
  shops: ShopDto[];

  @Expose()
  @ApiProperty({ type: ShopDto })
  @Type(() => ShopDto)
  managed_shop: ShopDto;

  @Expose()
  @ApiProperty({ type: AddressDto })
  @Type(() => AddressDto)
  address: AddressDto;
}