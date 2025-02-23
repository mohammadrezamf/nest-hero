import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';
import { FrontEndTimeSlot } from '../front-end-counseling/front-end-counseling-entity';
import { PsychologyTimeSlot } from '../psychology-counseling/psychoogy-counseling-entity';
import { LegalTimeSlot } from '../legal-counseling/legal-counseling-entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: { expiresIn: '17361907396' },
    }),
    TypeOrmModule.forFeature([
      User,
      CounselingTimeSlot,
      FrontEndTimeSlot,
      LegalTimeSlot,
      PsychologyTimeSlot,
    ]),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
