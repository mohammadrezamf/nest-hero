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
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Serve /uploads folder
      serveRoot: '/uploads', // Access with http://localhost:3000/uploads/...
    }),
    AuthModule,
    TasksModule,
    GeneralCounselingTimesModule,
    FrontEndCounselingModule,
    PsychologyCounselingModule,
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
    LegalCounselingModule,
    ArticleModule,
    UploadModule,
  ],
})
export class AppModule {}
