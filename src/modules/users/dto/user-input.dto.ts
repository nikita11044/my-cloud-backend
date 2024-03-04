import { ApiProperty } from '@nestjs/swagger';

export class UserInputDto {
  @ApiProperty({
    default: 'test@mail.com',
  })
  email: string;

  @ApiProperty({
    default: 'John Doe',
    required: false,
  })
  fullName?: string;

  @ApiProperty({
    default: 'pswd',
  })
  password: string;
}
