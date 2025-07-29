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
import { MentorFourCounselingService } from './mentor-four-counseling.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBookedDto } from '../general-counseling-times/dto/updateBookedDto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { UpdateActiveDto } from '../general-counseling-times/dto/updateActiveDto';
import { UpdateBookedByUserDto } from '../dto/updateBookedByMentorDto';

@Controller('mentor-four')
export class MentorFourCounselingController {
  constructor(
    private mentorFourCounselingService: MentorFourCounselingService,
  ) {}

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.mentorFourCounselingService.createWeekdaysAndTimeSlots();
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.mentorFourCounselingService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.mentorFourCounselingService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.mentorFourCounselingService.getSlotTimeWithDayAndUser(id);
  }

  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-book')
  async updateBooked(
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.mentorFourCounselingService.updateBooked(updateBookedDto, user);
  }

  // --------------- update--- active ---------
  @Patch('update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.mentorFourCounselingService.updateActiveStatus(
      updateActiveDto,
      user,
    );
  }

  @Patch('update-by-mentor')
  @UseGuards(AuthGuard('jwt'))
  async updateByMentor(
    @Body() customerPayload: UpdateBookedByUserDto,
    @GetUser() user: User,
  ) {
    const { role } = user;
    return this.mentorFourCounselingService.bookedByMentor(
      role,
      customerPayload,
    );
  }
}
