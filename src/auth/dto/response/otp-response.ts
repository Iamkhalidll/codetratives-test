import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OtpResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  phone_number: string;

  @Expose()
  @ApiProperty()
  verified: boolean;
}