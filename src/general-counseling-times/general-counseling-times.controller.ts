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

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.generalCounselingTimesService.createWeekdaysAndTimeSlots();
  }

  @Get('all-days')
  async getAllDaysWithTimeSlots() {
    return this.generalCounselingTimesService.getAllDaysWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.generalCounselingTimesService.deleteAllDaysWithTimeSlots();
  }
  // ------------ update -booked--------
  @UseGuards(AuthGuard('jwt'))
  @Patch(':day/update-book')
  async updateBooked(
    @Param('day') day: string,
    @Body() updateBookedDto: UpdateBookedDto,
    @GetUser() user: User,
  ) {
    return this.generalCounselingTimesService.updateBooked(
      day,
      updateBookedDto,
      user,
    );
  }

  // --------------- update--- active ---------
  @Patch(':day/update-Active')
  @UseGuards(AuthGuard('jwt'))
  async updateActiveStatus(
    @Param('day') day: string,
    @Body() updateActiveDto: UpdateActiveDto,
    @GetUser() user: User,
  ) {
    return this.generalCounselingTimesService.updateActiveStatus(
      day,
      updateActiveDto,
      user,
    );
  }
}
