import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const AuthConnection = {
  provide: 'AUTH_SERVICE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('AUTH_SERVICE_HOST'),
        port: configService.get<number>('AUTH_SERVICE_PORT'),
      },
    });
  },
};
@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthConnection],
  exports: [AuthConnection],
})
export class AuthModule {}
