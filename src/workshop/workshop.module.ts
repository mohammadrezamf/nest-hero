import { Module } from '@nestjs/common';
import { WorkshopsService } from './workshop.service';
import { WorkshopsController } from './workshop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Workshop } from './workshop.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop, User]), AuthModule],
  providers: [WorkshopsService],
  controllers: [WorkshopsController],
})
export class WorkshopModule {}
