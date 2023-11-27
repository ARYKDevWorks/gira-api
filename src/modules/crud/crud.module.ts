import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Global, Module } from '@nestjs/common';

const CrudService = {
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
  providers: [CrudService],
  exports: [CrudService],
})
export class CrudModule {}
