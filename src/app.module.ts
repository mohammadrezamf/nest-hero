import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
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
    TasksModule,
    AuthModule,
    // GeneralCounselingTimesModule,
  ],
})
export class AppModule {}
