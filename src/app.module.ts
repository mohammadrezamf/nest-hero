import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GeneralCounselingTimesModule } from './general-counseling-times/general-counseling-times.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FrontEndCounselingModule } from './front-end-counseling/front-end-counseling.module';
import { PsychologyCounselingModule } from './psychology-counseling/psychology-counseling.module';
import { LegalCounselingModule } from './legal-counseling/legal-counseling.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    TasksModule,
    GeneralCounselingTimesModule,
    FrontEndCounselingModule,
    PsychologyCounselingModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'tasks',
      autoLoadEntities: true,
      synchronize: true,
    }),
    LegalCounselingModule,
  ],
})
export class AppModule {}
