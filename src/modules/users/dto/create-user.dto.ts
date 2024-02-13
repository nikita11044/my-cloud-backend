import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'test@mail.com',
  })
  email: string;

  @ApiProperty({
    default: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    default: 'pswd',
  })
  password: string;
}
