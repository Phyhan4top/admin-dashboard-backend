import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  readonly status: 'ACTIVE' | 'INACTIVE';

  @IsNotEmpty()
  @IsAlphanumeric()
  readonly password: any;

  readonly role: 'ADMIN' | 'USER';
}
