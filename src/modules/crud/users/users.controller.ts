import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { EmailDto } from './dto/email.dto';
import { firstValueFrom } from 'rxjs';

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
  findOne(@Param('email') email: EmailDto) {
    return this.crudClient.send({ cmd: 'findUser' }, email.email);
  }

  @Patch(':email')
  @ApiCreatedResponse({ type: User })
  async update(
    @Param('email') email: EmailDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await firstValueFrom(
      this.crudClient.send({ cmd: 'editUser' }, { email, updateUserDto }),
    );
    if (updatedUser === 0) {
      throw new NotFoundException('User not found to update');
    }
    return updatedUser;
  }

  @Delete(':email')
  @ApiOkResponse({ type: User })
  async remove(@Param('email') email: EmailDto) {
    const deletedUser = await firstValueFrom(
      this.crudClient.send({ cmd: 'deleteUser' }, email),
    );
    if (deletedUser === 0) {
      throw new NotFoundException('User not found to delete');
    }
    return deletedUser;
  }
}
