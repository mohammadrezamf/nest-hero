import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GeneralCounselingTimesModule } from './general-counseling-times/general-counseling-times.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FrontEndCounselingModule } from './front-end-counseling/front-end-counseling.module';
import { PsychologyCounselingService } from './psychology-counseling/psychology-counseling.service';
import { PsychologyCounselingController } from './psychology-counseling/psychology-counseling.controller';
import { PsychologyCounselingModule } from './psychology-counseling/psychology-counseling.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    TasksModule,
    GeneralCounselingTimesModule,
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
    FrontEndCounselingModule,
    PsychologyCounselingModule,
  ],
  providers: [PsychologyCounselingService],
  controllers: [PsychologyCounselingController],
})
export class AppModule {}
