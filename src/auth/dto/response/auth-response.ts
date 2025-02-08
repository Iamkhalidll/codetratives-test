import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Permission } from '../create-auth.dto';

export class AuthResponseDto {
  @Expose()
  @ApiProperty()
  token: string;

  @Expose()
  @ApiProperty({ enum: Permission, isArray: true })
  permissions: Permission[];

  @Expose()
  @ApiProperty({ enum: Permission })
  role: Permission;

  @Expose()
  @ApiProperty()
  name: string;
}