import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import {
  PsychologyCounselingTimes,
  PsychologyTimeSlot,
} from './psychoogy-counseling-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { UpdateActiveDto } from '../general-counseling-times/dto/updateActiveDto';
import { User } from '../auth/user.entity';
import { UserRole } from '../auth/dto/auth-credential.dto';
import { UpdateBookedDto } from '../general-counseling-times/dto/updateBookedDto';

@Injectable()
export class PsychologyCounselingService {
  private readonly logger = new Logger(PsychologyCounselingService.name);

  constructor(
    @InjectRepository(PsychologyCounselingTimes)
    private psychologyCounselingTimesRepository: Repository<PsychologyCounselingTimes>,
    @InjectRepository(PsychologyTimeSlot)
    private psychologyTimeSlotRepository: Repository<PsychologyTimeSlot>,
  ) {}

  // CRON JOB: Run every hour
  @Cron(CronExpression.EVERY_HOUR) // Runs every hour
  async handleCron() {
    this.logger.log('Executing the scheduled task: createWeekdaysAndTimeSlots');
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
    const existingDays = await this.psychologyCounselingTimesRepository.find({
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
        const psychologyCounselingTime = new PsychologyCounselingTimes();
        psychologyCounselingTime.id = uuidv4();
        psychologyCounselingTime.day = dayOfWeek;
        psychologyCounselingTime.date = formattedDate;

        await this.psychologyCounselingTimesRepository.save(
          psychologyCounselingTime,
        );

        for (const hour of hours) {
          const timeSlot = new PsychologyTimeSlot();

          timeSlot.id = uuidv4();
          timeSlot.clock = hour;
          timeSlot.booked = false;
          timeSlot.active = false;
          timeSlot.psychologyCounselingTimes = psychologyCounselingTime;

          await this.psychologyTimeSlotRepository.save(timeSlot);
        }

        // Add newly created date to the Set to prevent further duplicates
        existingDatesSet.add(formattedDate);
      }
    }
    return { message: 'Days and time slots have been updated successfully!' };
  }

  //   ----------------------- GET ALL DAYS  ---------------------------------------------

  async getWeekWithTimeSlots() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 6); // Fetch for the next 7 days

    const [data, total] =
      await this.psychologyCounselingTimesRepository.findAndCount({
        relations: ['psychologyTimeSlots'], // ✅ Ensure time slots are included
      });
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= today && itemDate <= nextWeek;
    });

    filteredData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return {
      total,
      weekDaysTotal: filteredData.length,
      data: filteredData,
    };
  }

  // ------------------------ DELETE ----------------------------------------

  async deleteAllDaysWithTimeSlots() {
    await this.psychologyTimeSlotRepository.delete({});
    await this.psychologyCounselingTimesRepository.delete({});

    return {
      message: 'All days and time slots have been deleted successfully!',
    };
  }

  // ---------- get slot with user and day ----------------
  async getSlotTimeWithDayAndUser(slotTimeId: string) {
    try {
      // Query the CounselingTimeSlot with relations
      const slotTime = await this.psychologyTimeSlotRepository.findOne({
        where: { id: slotTimeId },
        relations: ['psychologyCounselingTimes', 'user'],
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
              username: slotTime.user.phoneNumber,
              role: slotTime.user.role,
            }
          : null,
        psychologyCounselingTimes: {
          id: slotTime.psychologyCounselingTimes.id,
          day: slotTime.psychologyCounselingTimes.day,
          date: slotTime.psychologyCounselingTimes.date,
        },
      };
    } catch (error) {
      throw new Error(`Failed to retrieve slotTime: ${error.message}`);
    }
  }

  //   ------------------- UPD0ATE BOOKED ---------------------------------------
  async updateActiveStatus(updateActiveDto: UpdateActiveDto, user: User) {
    try {
      if (user.role === UserRole.USER) {
        return new BadRequestException(
          `You do not have permission to perform this action`,
        );
      }

      // Find the specific time slot by its ID
      const timeSlot = await this.psychologyTimeSlotRepository.findOne({
        where: { id: updateActiveDto.timeSlotID },
      });

      if (!timeSlot) {
        return {
          message: `Time slot with ID ${updateActiveDto.timeSlotID} was not found.`,
        };
      }

      // Update the active status
      timeSlot.active = updateActiveDto.active;
      timeSlot.user = user;

      // Save the updated time slot to the database
      await this.psychologyTimeSlotRepository.save(timeSlot);

      return {
        message: `Active status for time slot with ID ${updateActiveDto.timeSlotID} updated successfully.`,
        updatedTimeSlot: timeSlot,
      };
    } catch (error) {
      throw new Error(`Failed to update Active: ${error.message}`);
    }
  }

  //   ------------------- UPD0ATE BOOKED ---------------------------------------
  async updateBooked(updateBookedDto: UpdateBookedDto, user: User) {
    try {
      if (user.role === UserRole.PSYCHOLOGY) {
        return new BadRequestException(
          `You do not have permission to perform this action`,
        );
      }

      // Find the specific time slot by its ID
      const timeSlot = await this.psychologyTimeSlotRepository.findOne({
        where: { id: updateBookedDto.timeSlotID },
      });

      if (!timeSlot) {
        return {
          message: `Time slot with ID ${updateBookedDto.timeSlotID} was not found.`,
        };
      }

      // Update the booking status
      timeSlot.booked = updateBookedDto.booked;
      timeSlot.user = user;

      // Save the updated time slot to the database
      await this.psychologyTimeSlotRepository.save(timeSlot);

      return {
        message: `Booking status for time slot with ID ${updateBookedDto.timeSlotID} updated successfully.`,
        updatedTimeSlot: timeSlot,
      };
    } catch (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  }
}
