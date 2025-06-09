import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto.username, createUserDto.password);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.getProfile(+id);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
