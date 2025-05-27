import { Module } from '@nestjs/common';
import { SecurityCounselingService } from './security-counseling.service';
import { SecurityCounselingController } from './security-counseling.controller';
import {
  SecurityCounselingTimes,
  SecurityTimeSlot,
} from './security-counseling.entity';
import { AuthModule } from '../auth/auth.module';
import { ResendModule } from '../resend/resend.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityCounselingTimes, SecurityTimeSlot]),
    AuthModule,
    ResendModule,
  ],
  providers: [SecurityCounselingService],
  controllers: [SecurityCounselingController],
})
export class SecurityCounselingModule {}
