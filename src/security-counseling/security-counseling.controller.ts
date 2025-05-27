import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBookedDto } from '../general-counseling-times/dto/updateBookedDto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { UpdateActiveDto } from '../general-counseling-times/dto/updateActiveDto';
import { SecurityCounselingService } from './security-counseling.service';

@Controller('security-counseling')
export class SecurityCounselingController {
  constructor(private securityCounselingService: SecurityCounselingService) {}

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.securityCounselingService.createWeekdaysAndTimeSlots();
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.securityCounselingService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.securityCounselingService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.securityCounselingService.getSlotTimeWithDayAndUser(id);
  }

  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-book')
  async updateBooked(
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.securityCounselingService.updateBooked(updateBookedDto, user);
  }

  // --------------- update--- active ---------
  @Patch('update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.securityCounselingService.updateActiveStatus(
      updateActiveDto,
      user,
    );
  }
}
