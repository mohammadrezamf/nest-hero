import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CounselingTimeSlot,
  GeneralCounselingTimes,
} from './general.counseling.times.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UpdateBookedDto } from './dto/updateBookedDto';
import { UpdateActiveDto } from './dto/updateActiveDto';
import { User } from '../auth/user.entity';
import { UserRole } from '../auth/dto/auth-credential.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GeneralCounselingTimesService {
  private readonly logger = new Logger(GeneralCounselingTimesService.name);
  constructor(
    @InjectRepository(GeneralCounselingTimes)
    private generalCounselingTimesRepository: Repository<GeneralCounselingTimes>,
    @InjectRepository(CounselingTimeSlot)
    private counselingTimeSlotRepository: Repository<CounselingTimeSlot>,
  ) {}

  // CRON JOB: Run every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Running createWeekdaysAndTimeSlots Cron Job...');
    await this.createWeekdaysAndTimeSlots();
  }

  // ----------------- CREATE DAYS AND SLOT ----------------------
  async createWeekdaysAndTimeSlots() {
    const daysOfWeek = [
      'saturday',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ];
    const hours = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
    ];

    const today = new Date();

    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14); // Set the range for two weeks

    // Fetch all existing dates within the two-week range
    const existingDays = await this.generalCounselingTimesRepository.find({
      where: {
        date: Between(
          today.toISOString().split('T')[0],
          twoWeeksLater.toISOString().split('T')[0],
        ),
      },
    });

    // Convert existing dates to a Set for quick lookup
    const existingDatesSet = new Set(existingDays.map((day) => day.date));

    // Iterate through the next 14 days and check if the date already exists
    for (let i = 0; i < 14; i++) {
      // Loop for 14 days (2 weeks)
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayOfWeek = currentDate
        .toLocaleString('en-US', { weekday: 'long' })
        .toLowerCase();
      if (!daysOfWeek.includes(dayOfWeek)) continue; // Skip invalid days

      const formattedDate = currentDate.toISOString().split('T')[0]; // Store date without time

      if (!existingDatesSet.has(formattedDate)) {
        // If the date is missing, create it
        const generalCounselingTime = new GeneralCounselingTimes();
        generalCounselingTime.day = dayOfWeek;
        generalCounselingTime.date = formattedDate;

        await this.generalCounselingTimesRepository.save(generalCounselingTime);

        for (const hour of hours) {
          const timeSlot = new CounselingTimeSlot();
          timeSlot.clock = hour;
          timeSlot.booked = false;
          timeSlot.active = false;
          timeSlot.generalCounselingTimes = generalCounselingTime;

          await this.counselingTimeSlotRepository.save(timeSlot);
        }

        // Add newly created date to the Set to prevent further duplicates
        existingDatesSet.add(formattedDate);
      }
    }

    return { message: 'Days and time slots have been updated successfully!' };
  }

  // --------------------------------------------------------------------------

  //   ----------------------- GET ALL DAYS  ---------------------------------------------

  async getAllDaysWithTimeSlots() {
    // Fetch all GeneralCounselingTimes with their associated time slots

    const [data, total] =
      await this.generalCounselingTimesRepository.findAndCount({
        relations: ['timeSlots'], // This will load the related timeSlots for each day
      });
    // Return both total and data in the response
    return {
      total,
      data,
    };
  }

  // ------------------------ DELETE ----------------------------------------

  async deleteAllDaysWithTimeSlots() {
    await this.counselingTimeSlotRepository.delete({});
    await this.generalCounselingTimesRepository.delete({});

    return {
      message: 'All days and time slots have been deleted successfully!',
    };
  }

  // ---------------find day by id ---------------------------------
  async getDayByDay(day: string) {
    const record = await this.generalCounselingTimesRepository.findOne({
      where: { day },
    });
    if (!record) {
      throw new NotFoundException(`A day with name ${day} was not found.`);
    }
    return record;
  }

  // ---------- get slot with user and day ----------------
  async getSlotTimeWithDayAndUser(slotTimeId: string) {
    try {
      // Query the CounselingTimeSlot with relations
      const slotTime = await this.counselingTimeSlotRepository.findOne({
        where: { id: slotTimeId },
        relations: ['generalCounselingTimes', 'user'],
      });

      // Throw an error if the slotTime is not found
      if (!slotTime) {
        throw new NotFoundException(
          `CounselingTimeSlot with ID ${slotTimeId} was not found.`,
        );
      }

      // Return the raw slotTime with relations
      return {
        id: slotTime.id,
        clock: slotTime.clock,
        booked: slotTime.booked,
        active: slotTime.active,
        user: slotTime.user
          ? {
              id: slotTime.user.id,
              username: slotTime.user.username,
              role: slotTime.user.role,
            }
          : null,
        generalCounselingTimes: {
          id: slotTime.generalCounselingTimes.id,
          day: slotTime.generalCounselingTimes.day,
          date: slotTime.generalCounselingTimes.date,
        },
      };
    } catch (error) {
      throw new Error(`Failed to retrieve slotTime: ${error.message}`);
    }
  }

  //   ------------------- UPD0ATE BOOKED ---------------------------------------
  async updateActiveStatus(
    day: string,
    updateActiveDto: UpdateActiveDto,
    user: User,
  ) {
    try {
      if (user.role === UserRole.USER) {
        return new BadRequestException(
          `You do not have permission to perform this action`,
        );
      }
      // Find the day with its associated time slots
      const generalDayFounded = await this.getDayByDay(day);

      // Find the specific time slot by its ID
      const timeSlot = generalDayFounded.timeSlots.find(
        (item) => item.id === updateActiveDto.timeSlotID,
      );

      if (!timeSlot) {
        throw new NotFoundException(
          `Time slot with ID ${updateActiveDto.timeSlotID} was not found.`,
        );
      }

      // Update the active status
      timeSlot.active = updateActiveDto.active;
      timeSlot.user = user;

      // Save the updated time slot to the database
      await this.counselingTimeSlotRepository.save(timeSlot);

      return {
        message: `Active status for time slot with ID ${updateActiveDto.timeSlotID} updated successfully.`,
        updatedTimeSlot: timeSlot,
      };
    } catch (error) {
      throw new Error(`Failed to update Active: ${error.message}`);
    }
  }

  //   ------------------- UPD0ATE BOOKED ---------------------------------------
  async updateBooked(
    day: string,
    updateBookedDto: UpdateBookedDto,
    user: User,
  ) {
    try {
      if (user.role === UserRole.MODERATOR) {
        return new BadRequestException(
          `You do not have permission to perform this action`,
        );
      }
      // Find the day with its associated time slots
      const generalDayFounded = await this.getDayByDay(day);
      console.log('generalDayFounded', generalDayFounded);
      // Find the specific time slot by its ID
      const timeSlot = generalDayFounded.timeSlots.find(
        (item) => item.id === updateBookedDto.timeSlotID,
      );

      if (!timeSlot) {
        return {
          message: `Time slot with ID ${updateBookedDto.timeSlotID} was not found.`,
        };
      }

      // Update the booking status
      timeSlot.booked = updateBookedDto.booked;
      timeSlot.user = user;

      // Save the updated time slot to the database
      await this.counselingTimeSlotRepository.save(timeSlot);

      return {
        message: `Booking status for time slot with ID ${updateBookedDto.timeSlotID} updated successfully.`,
        updatedTimeSlot: timeSlot,
      };
    } catch (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  }
}
