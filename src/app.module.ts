import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { GeneralCounselingTimesModule } from './general-counseling-times/general-counseling-times.module';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';

@Module({
  imports: [
    TypeOrmCoreModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // SQLite database file
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TasksModule,
    GeneralCounselingTimesModule,
  ],
})
export class AppModule {}
