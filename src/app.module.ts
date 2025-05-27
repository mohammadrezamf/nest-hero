import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GeneralCounselingTimesModule } from './general-counseling-times/general-counseling-times.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FrontEndCounselingModule } from './front-end-counseling/front-end-counseling.module';
import { PsychologyCounselingModule } from './psychology-counseling/psychology-counseling.module';
import { LegalCounselingModule } from './legal-counseling/legal-counseling.module';
import { ArticleModule } from './article/article.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './file/file.module';

import * as dotenv from 'dotenv';
import { MailModule } from './mail/mail.module';
import { ResendModule } from './resend/resend.module';
import { BackEndCounselingModule } from './back-end-counseling/back-end-counseling.module';
import { ProductManagerCounselingModule } from './product-manager-counseling/product-manager-counseling.module';
import { SecurityCounselingModule } from './security-counseling/security-counseling.module';
import { DesignerCounselingModule } from './designer-counseling/designer-counseling.module';

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
    FrontEndCounselingModule,
    PsychologyCounselingModule,
    LegalCounselingModule,
    ArticleModule,
    FileModule,
    MailModule,
    ResendModule,
    BackEndCounselingModule,
    ProductManagerCounselingModule,
    SecurityCounselingModule,
    DesignerCounselingModule,
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
  ],
})
export class AppModule {}
