import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { GeneralCounselingTimesService } from './general-counseling-times.service';
import { GeneralCounselingTimes } from './general.model';
import { UpdateActiveDto } from './dto/updateActiveDto';

@Controller('general-counseling-times')
export class GeneralCounselingTimesController {
  constructor(
    private generalCounselingTimesService: GeneralCounselingTimesService,
  ) {}

  @Get()
  getAllGeneralDay(): GeneralCounselingTimes[] {
    return this.generalCounselingTimesService.getAllGeneralDay();
  }

  @Patch(':id/active')
  updateActive(
    @Param('id') id: string,
    @Body() updateActiveDto: UpdateActiveDto,
  ): GeneralCounselingTimes {
    const { clock, active } = updateActiveDto;
    return this.generalCounselingTimesService.updateActive(id, active, clock);
  }
}
