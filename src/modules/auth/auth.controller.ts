import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { UserAuthDto } from './dto/user-auth.dto';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  @ApiCreatedResponse({ type: Boolean })
  @ApiOkResponse()
  async signUp(@Body() userAuth: UserAuthDto) {
    const pass = await this.authService.passHash(userAuth.pass);
    const email = userAuth.email;
    return this.authClient.send({ cmd: 'signUp' }, { email, pass });
  }

  @Post('/login')
  @ApiCreatedResponse({ type: Boolean })
  @ApiOkResponse()
  async logIn(@Body() userAuth: UserAuthDto) {
    const email = userAuth.email;
    const passHash = await firstValueFrom(
      this.authClient.send({ cmd: 'logIn' }, { email }),
    );
    if (passHash === 0) {
      throw new NotFoundException('User not found');
    }
    return await this.authService.checkPass(userAuth.pass, passHash);
  }
}
