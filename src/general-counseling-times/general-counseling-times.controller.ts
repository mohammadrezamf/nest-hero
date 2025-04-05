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
import { GeneralCounselingTimesService } from './general-counseling-times.service';
import { UpdateBookedDto } from './dto/updateBookedDto';
import { UpdateActiveDto } from './dto/updateActiveDto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('general-counseling-times')
export class GeneralCounselingTimesController {
  constructor(
    private generalCounselingTimesService: GeneralCounselingTimesService,
  ) {}

  @Post('create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.generalCounselingTimesService.createWeekdaysAndTimeSlots();
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.generalCounselingTimesService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.generalCounselingTimesService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.generalCounselingTimesService.getSlotTimeWithDayAndUser(
      id,
    );
  }

  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch('update-book')
  async updateBooked(
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.generalCounselingTimesService.updateBooked(
      updateBookedDto,
      user,
    );
  }

  // --------------- update--- active ---------
  @Patch('update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.generalCounselingTimesService.updateActiveStatus(
      updateActiveDto,
      user,
    );
  }
}
