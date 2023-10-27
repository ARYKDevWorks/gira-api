import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService],
  imports: [PrismaModule],
})
export class IssuesModule {}
