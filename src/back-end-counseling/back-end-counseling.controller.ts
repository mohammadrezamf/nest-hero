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
import { BackEndCounselingService } from './back-end-counseling.service';

@Controller('back-end-counseling')
export class BackEndCounselingController {
  constructor(private backEndCounselingService: BackEndCounselingService) {}

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.backEndCounselingService.createWeekdaysAndTimeSlots();
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.backEndCounselingService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.backEndCounselingService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.backEndCounselingService.getSlotTimeWithDayAndUser(id);
  }

  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-book')
  async updateBooked(
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.backEndCounselingService.updateBooked(updateBookedDto, user);
  }

  // --------------- update--- active ---------
  @Patch('update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.backEndCounselingService.updateActiveStatus(
      updateActiveDto,
      user,
    );
  }
}
