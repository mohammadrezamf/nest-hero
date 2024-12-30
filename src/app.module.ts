import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { GeneralCounselingTimesModule } from './general-counseling-times/general-counseling-times.module';

@Module({
  imports: [TasksModule, GeneralCounselingTimesModule],
})
export class AppModule {}
