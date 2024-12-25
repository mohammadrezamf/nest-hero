import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TaskController } from './task/task.controller';
import { TaskController } from './task/task.controller';

@Module({
  imports: [TasksModule],
  controllers: [TaskController],
})
export class AppModule {}

