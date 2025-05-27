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
import { ProductManagerCounselingService } from './product-manager-counseling.service';

@Controller('product-manager-counseling')
export class ProductManagerCounselingController {
  constructor(
    private productManagerCounselingService: ProductManagerCounselingService,
  ) {}

  @Post('/create-day')
  async createWeekdaysAndTimeSlots() {
    return await this.productManagerCounselingService.createWeekdaysAndTimeSlots();
  }

  @Get('one-week')
  async getAllDaysWithTimeSlots() {
    return this.productManagerCounselingService.getWeekWithTimeSlots();
  }

  @Delete('delete-days')
  async deleteAllDaysWithTimeSlots() {
    return await this.productManagerCounselingService.deleteAllDaysWithTimeSlots();
  }

  @Get(':slotTimeId/slot-time')
  async getSlotTimeWithDayAndUser(@Param('slotTimeId') id: string) {
    return await this.productManagerCounselingService.getSlotTimeWithDayAndUser(
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
    return this.productManagerCounselingService.updateBooked(
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
    return this.productManagerCounselingService.updateActiveStatus(
      updateActiveDto,
      user,
    );
  }
}
