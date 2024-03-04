import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { UserInputDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { UserId } from '../../shared';
// import {AuthGuard} from "@nestjs/passport";

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(`/:id`)
  @UseGuards(JwtAuthGuard)
  async getUser(@UserId() id: string) {
    return await this.usersService.findById(id);
  }

  @Post()
  @ApiBody({ type: UserInputDto })
  async createUser(@Body() createUserDto: UserInputDto) {
    return await this.usersService.create(createUserDto);
  }

  @Put('/:id')
  @ApiBody({ type: UserInputDto })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
