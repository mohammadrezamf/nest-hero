import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { GeneralCounselingTimesService } from './general-counseling-times.service';
import { GeneralCounselingTimes } from './general.counseling.times.entity';
import { UpdateBookedDto } from './dto/updateBookedDto';

@Controller('general-counseling-times')
export class GeneralCounselingTimesController {
  constructor(
    private generalCounselingTimesService: GeneralCounselingTimesService,
  ) {}

  // @Get()
  // getAllGeneralDay(): Promise<GeneralCounselingTimes[]> {
  //   return this.generalCounselingTimesService.getAllGeneralDay();
  // }

  // @Patch(':id/active')
  // updateActive(
  //   @Param('id') id: string,
  //   @Body() updateActiveDto: UpdateActiveDto,
  // ): GeneralCounselingTimes {
  //   const { clock, active } = updateActiveDto;
  //   return this.generalCounselingTimesService.updateActive(id, active, clock);
  // }
  //

  @Post('/createday')
  async createWeekdaysAndTimeSlots() {
    return await this.generalCounselingTimesService.createWeekdaysAndTimeSlots();
  }

  @Get('all-days')
  async getAllDaysWithTimeSlots() {
    return this.generalCounselingTimesService.getAllDaysWithTimeSlots();
  }
}
