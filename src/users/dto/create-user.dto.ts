import { PickType } from '@nestjs/swagger';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { User } from '../entities/user.entity';

enum Permission {
  SUPER_ADMIN = 'Super admin',
  STORE_OWNER = 'Store owner',
  STAFF = 'Staff',
  CUSTOMER = 'Customer',
}
export class CreateUserDto extends PickType(User, [
  'name',
  'email',
  'password',
]) {
  address: CreateAddressDto[];
  permission: Permission = Permission.CUSTOMER;
}
