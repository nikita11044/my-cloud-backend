import { ApiProperty } from '@nestjs/swagger';

export class AuthInputDto {
  @ApiProperty({
    default: 'test@mail.com',
  })
  email: string;

  @ApiProperty({
    default: 'pswd',
  })
  password: string;
}
