import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config, ConfigSchema } from './config/config';
import { UsersModule } from './modules/crud/users/users.module';
import { ProjectsModule } from './modules/crud/projects/projects.module';
import { IssuesModule } from './modules/crud/issues/issues.module';
import { CommentsModule } from './modules/crud/comments/comments.module';
import { CrudModule } from './modules/crud/crud.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
      validationSchema: ConfigSchema,
      expandVariables: true,
      isGlobal: true,
    }),
    CrudModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    IssuesModule,
    CommentsModule,
  ],
})
export class AppModule {}
