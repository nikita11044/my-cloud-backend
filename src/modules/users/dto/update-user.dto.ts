import { PartialType } from '@nestjs/mapped-types';
import { UserInputDto } from './user-input.dto';

export class UpdateUserDto extends PartialType(UserInputDto) {}
