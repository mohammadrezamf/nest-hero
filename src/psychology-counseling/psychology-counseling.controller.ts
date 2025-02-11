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
import { PsychologyCounselingService } from './psychology-counseling.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBookedDto } from '../general-counseling-times/dto/updateBookedDto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { UpdateActiveDto } from '../general-counseling-times/dto/updateActiveDto';

@Controller('psychology-counseling')
export class PsychologyCounselingController {
  constructor(
    private psychologyCounselingService: PsychologyCounselingService,
  ) {}

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.psychologyCounselingService.createWeekdaysAndTimeSlots();
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.psychologyCounselingService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.psychologyCounselingService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.psychologyCounselingService.getSlotTimeWithDayAndUser(id);
  }

  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-book')
  async updateBooked(
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.psychologyCounselingService.updateBooked(updateBookedDto, user);
  }

  // --------------- update--- active ---------
  @Patch('update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.psychologyCounselingService.updateActiveStatus(
      updateActiveDto,
      user,
    );
  }
}
