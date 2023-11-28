import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Global, Module } from '@nestjs/common';

const CrudConnection = {
  provide: 'CRUD_SERVICE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('CRUD_SERVICE_HOST'),
        port: configService.get<number>('CRUD_SERVICE_PORT'),
      },
    });
  },
};

@Global()
@Module({
  providers: [CrudConnection],
  exports: [CrudConnection],
})
export class CrudModule {}
