import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrudConfig, CrudSchema } from './config/crud.config';
import { UsersModule } from './modules/crud/users/users.module';
import { ProjectsModule } from './modules/crud/projects/projects.module';
import { IssuesModule } from './modules/crud/issues/issues.module';
import { CommentsModule } from './modules/crud/comments/comments.module';
import { CrudModule } from './modules/crud/crud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [CrudConfig],
      validationSchema: CrudSchema,
      expandVariables: true,
      isGlobal: true,
    }),
    CrudModule,
    UsersModule,
    ProjectsModule,
    IssuesModule,
    CommentsModule,
  ],
})
export class AppModule {}
