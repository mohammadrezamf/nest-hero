import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MentorTwoCounselingService } from './mentor-two-counseling.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateBookedDto } from '../general-counseling-times/dto/updateBookedDto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { UpdateActiveDto } from '../general-counseling-times/dto/updateActiveDto';
import { UpdateBookedByUserDto } from '../dto/updateBookedByMentorDto';

@Controller('mentor-two')
export class MentorTwoCounselingController {
  constructor(private mentorTwoCounselingService: MentorTwoCounselingService) {}

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.mentorTwoCounselingService.createWeekdaysAndTimeSlots();
  }

  @Get()
  getAllSlots(@Query('page') page = 1, @Query('limit') limit = 100) {
    return this.mentorTwoCounselingService.getAllSlots(+page, +limit);
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.mentorTwoCounselingService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.mentorTwoCounselingService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.mentorTwoCounselingService.getSlotTimeWithDayAndUser(id);
  }

  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-book')
  async updateBooked(
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.mentorTwoCounselingService.updateBooked(updateBookedDto, user);
  }

  // --------------- update--- active ---------
  @Patch('update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.mentorTwoCounselingService.updateActiveStatus(
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
    return this.mentorTwoCounselingService.bookedByMentor(
      role,
      customerPayload,
    );
  }
}
