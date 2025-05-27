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
import { DesignerCounselingService } from './designer-counseling.service';

@Controller('designer-counseling')
export class DesignerCounselingController {
  constructor(private designCounselingService: DesignerCounselingService) {}

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.designCounselingService.createWeekdaysAndTimeSlots();
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.designCounselingService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.designCounselingService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.designCounselingService.getSlotTimeWithDayAndUser(id);
  }

  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-book')
  async updateBooked(
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.designCounselingService.updateBooked(updateBookedDto, user);
  }

  // --------------- update--- active ---------
  @Patch('update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.designCounselingService.updateActiveStatus(
      updateActiveDto,
      user,
    );
  }
}
