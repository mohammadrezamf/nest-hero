import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WorkshopsService } from './workshop.service';
import { Workshop } from './workshop.entity';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopService: WorkshopsService) {}

  @Get()
  findAll(): Promise<Workshop[]> {
    return this.workshopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Workshop> {
    return this.workshopService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createWorkshop(@Body() body: CreateWorkshopDto, @GetUser() user: User) {
    return this.workshopService.create(body, user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: Partial<Workshop>) {
    return this.workshopService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.workshopService.delete(+id);
  }

  @Patch(':id/add-user')
  addUserToWorkshop(
    @Param('id') workshopId: number,
    @Body('userId') userId: string,
  ) {
    return this.workshopService.addUserToWorkshop(workshopId, userId);
  }
}
