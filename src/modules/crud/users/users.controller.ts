import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    @Inject('CRUD_SERVICE') private readonly crudClient: ClientProxy,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.crudClient.send({ cmd: 'createUser' }, createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: User, isArray: true })
  findAll() {
    return this.crudClient.send({ cmd: 'allUsers' }, {});
  }

  @Get(':email')
  @ApiOkResponse({ type: User })
  findOne(@Param('email') email: string) {
    return this.crudClient.send({ cmd: 'findUser' }, email);
  }

  @Patch(':email')
  @ApiCreatedResponse({ type: User })
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.crudClient.send({ cmd: 'editUser' }, { email, updateUserDto });
  }

  @Delete(':email')
  @ApiOkResponse({ type: User })
  remove(@Param('email') email: string) {
    return this.crudClient.send({ cmd: 'deleteUser' }, email);
  }
}
