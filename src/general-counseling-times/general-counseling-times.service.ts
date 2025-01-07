import { Injectable } from '@nestjs/common';
import {
  CounselingTimeSlot,
  GeneralCounselingTimes,
} from './general.counseling.times.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GeneralCounselingTimesService {
  constructor(
    @InjectRepository(GeneralCounselingTimes)
    private generalCounselingTimesRepository: Repository<GeneralCounselingTimes>,
    @InjectRepository(CounselingTimeSlot)
    private counselingTimeSlotRepository: Repository<CounselingTimeSlot>,
  ) {}

  async createWeekdaysAndTimeSlots() {
    const daysOfWeek = ['sa', 'sun', 'mon', 'tue', 'wed', 'the', 'fri'];
    const hours = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
    ];

    // ایجاد روزهای هفته و ساعت‌ها
    for (const day of daysOfWeek) {
      // ابتدا روز هفته را ایجاد می‌کنیم

      const generalCounselingTime = new GeneralCounselingTimes();
      generalCounselingTime.day = day;

      // ذخیره روز هفته
      await this.generalCounselingTimesRepository.save(generalCounselingTime);

      // ایجاد ساعت‌ها برای هر روز
      for (const hour of hours) {
        const timeSlot = new CounselingTimeSlot();
        timeSlot.clock = hour;
        timeSlot.booked = false;
        timeSlot.active = true;
        timeSlot.generalCounselingTimes = generalCounselingTime; // ارتباط با روز هفته

        // ذخیره ساعت
        await this.counselingTimeSlotRepository.save(timeSlot);
      }
    }

    return { message: 'Days and time slots have been created successfully!' };
  }

  //   ---------------------------
  async getAllDaysWithTimeSlots() {
    // Fetch all GeneralCounselingTimes with their associated time slots
    return await this.generalCounselingTimesRepository.find({
      relations: ['timeSlots'], // This will load the related timeSlots for each day
    });
  }
}
