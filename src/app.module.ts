import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GeneralCounselingTimesModule } from './general-counseling-times/general-counseling-times.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MentorOneCounselingModule } from './mentor-one/mentor-one-counseling.module';
import { ArticleModule } from './article/article.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './file/file.module';

import * as dotenv from 'dotenv';
import { MailModule } from './mail/mail.module';
import { ResendModule } from './resend/resend.module';
import { MentorTwoCounselingModule } from './mentor-two/mentor-two-counseling.module';
import { MentorThreeCounselingModule } from './mentor-three/mentor-three-counseling.module';
import { MentorFourCounselingModule } from './mentor-four/mentor-four-counseling.module';
import { WorkshopModule } from './workshop/workshop.module';

dotenv.config();

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    TasksModule,
    GeneralCounselingTimesModule,
    MentorOneCounselingModule,
    MentorTwoCounselingModule,
    MentorThreeCounselingModule,
    MentorFourCounselingModule,
    ArticleModule,
    FileModule,
    MailModule,
    ResendModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST, // Use environment variable
      port: parseInt(process.env.DB_PORT, 10), // Parse the port number
      username: process.env.DB_USERNAME, // Use environment variable
      password: process.env.DB_PASSWORD, // Use environment variable
      database: process.env.DB_DATABASE, // Use environment variable
      autoLoadEntities: true,
      synchronize: true,
    }),
    WorkshopModule,
  ],
})
export class AppModule {}
