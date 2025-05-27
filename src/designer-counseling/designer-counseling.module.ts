import { Module } from '@nestjs/common';
import { DesignerCounselingService } from './designer-counseling.service';
import { DesignerCounselingController } from './designer-counseling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  DesignCounselingTimes,
  DesignTimeSlot,
} from './designer-counseling-entity';
import { ResendModule } from '../resend/resend.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DesignCounselingTimes, DesignTimeSlot]),
    ResendModule,
    AuthModule,
  ],
  providers: [DesignerCounselingService],
  controllers: [DesignerCounselingController],
})
export class DesignerCounselingModule {}
