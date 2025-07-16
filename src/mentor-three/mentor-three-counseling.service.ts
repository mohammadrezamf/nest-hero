import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import {
  MentorThreeCounselingTimes,
  MentorThreeTimeSlot,
} from './mentor-three-counseling-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { UpdateActiveDto } from '../general-counseling-times/dto/updateActiveDto';
import { User } from '../auth/user.entity';
import { UserRole } from '../auth/dto/auth-credential.dto';
import { UpdateBookedDto } from '../general-counseling-times/dto/updateBookedDto';
import { ResendService } from '../resend/resend.service';
import { UpdateBookedByUserDto } from '../dto/updateBookedByMentorDto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MentorThreeCounselingService {
  private readonly logger = new Logger(MentorThreeCounselingService.name);

  constructor(
    @InjectRepository(MentorThreeCounselingTimes)
    private mentorThreeCounselingTimesRepository: Repository<MentorThreeCounselingTimes>,
    @InjectRepository(MentorThreeTimeSlot)
    private mentorThreeTimeSlotRepository: Repository<MentorThreeTimeSlot>,
    private readonly authService: AuthService,
    private readonly resendService: ResendService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Executing the scheduled task: createWeekdaysAndTimeSlots');
    await this.createWeekdaysAndTimeSlots();
  }

  //   --------------- CREATE DAYS AND SLOT ---------------------
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
    const hours = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14); // Set the range for two weeks

    // Fetch all existing dates within the two-week range
    const existingDays = await this.mentorThreeCounselingTimesRepository.find({
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
        const mentorThreeCounselingTime = new MentorThreeCounselingTimes();
        mentorThreeCounselingTime.id = uuidv4();
        mentorThreeCounselingTime.day = dayOfWeek;
        mentorThreeCounselingTime.date = formattedDate;

        await this.mentorThreeCounselingTimesRepository.save(
          mentorThreeCounselingTime,
        );

        for (const hour of hours) {
          const timeSlot = new MentorThreeTimeSlot();

          timeSlot.id = uuidv4();
          timeSlot.clock = hour;
          timeSlot.booked = false;
          timeSlot.active = false;
          timeSlot.mentorThreeCounselingTimes = mentorThreeCounselingTime;

          await this.mentorThreeTimeSlotRepository.save(timeSlot);
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
      await this.mentorThreeCounselingTimesRepository.findAndCount({
        relations: ['mentorThreeTimeSlots', 'mentorThreeTimeSlots.user'], // ✅ Ensure time slots are included
      });
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= today && itemDate <= nextWeek;
    });

    filteredData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const responseData = filteredData.map((item) => ({
      id: item.id,
      day: item.day,
      date: item.date,
      mentorThreeTimeSlots: item.mentorThreeTimeSlots.map((slot) => ({
        id: slot.id,
        active: slot.active,
        booked: slot.booked,
        clock: slot.clock,
        user:
          slot.user && slot.booked
            ? {
                id: slot.user?.id,
                phoneNumber: slot.user?.phoneNumber, // ✅ Include user details if booked
                displayName: slot.user?.displayName,
                email: slot.user?.email,
              }
            : null,
      })),
    }));

    return {
      total,
      weekDaysTotal: filteredData.length,
      data: responseData,
    };
  }

  // ------------------------ DELETE ----------------------------------------

  async deleteAllDaysWithTimeSlots() {
    await this.mentorThreeTimeSlotRepository.delete({});
    await this.mentorThreeCounselingTimesRepository.delete({});

    return {
      message: 'All days and time slots have been deleted successfully!',
    };
  }

  // ---------- get slot with user and day ----------------
  async getSlotTimeWithDayAndUser(slotTimeId: string) {
    try {
      // Query the CounselingTimeSlot with relations
      const slotTime = await this.mentorThreeTimeSlotRepository.findOne({
        where: { id: slotTimeId },
        relations: ['mentorThreeCounselingTimes', 'user'],
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
        mentorThreeCounselingTimes: {
          id: slotTime.mentorThreeCounselingTimes.id,
          day: slotTime.mentorThreeCounselingTimes.day,
          date: slotTime.mentorThreeCounselingTimes.date,
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
      const timeSlot = await this.mentorThreeTimeSlotRepository.findOne({
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
      await this.mentorThreeTimeSlotRepository.save(timeSlot);

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
      if (user.role === UserRole.MENTOR_ONE) {
        return new BadRequestException(
          `You do not have permission to perform this action`,
        );
      }

      // Find the specific time slot by its ID
      const timeSlot = await this.mentorThreeTimeSlotRepository.findOne({
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
      await this.mentorThreeTimeSlotRepository.save(timeSlot);
      if (timeSlot.creatorEmail) {
        await this.resendService.sendEmail(
          timeSlot.creatorEmail,
          `name od customer:${user.displayName} phone number ${user.phoneNumber}`,
          `<strong>The time slot has been updated.</strong>`,
        );
      }

      return {
        message: `Booking status for time slot with ID ${updateBookedDto.timeSlotID} updated successfully.`,
        updatedTimeSlot: timeSlot,
      };
    } catch (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  }

  async bookedByMentor(
    mentorRole: UserRole,
    customerPayload: UpdateBookedByUserDto,
  ) {
    try {
      if (mentorRole === UserRole.USER) {
        return new BadRequestException(
          `You do not have permission to perform this action`,
        );
      }

      // Find the specific time slot by its ID
      const timeSlot = await this.mentorThreeTimeSlotRepository.findOne({
        where: { id: customerPayload.timeSlotID },
      });

      if (!timeSlot) {
        return {
          message: `Time slot with ID ${customerPayload.timeSlotID} was not found.`,
        };
      }

      // Update the booking status
      timeSlot.booked = customerPayload.booked;

      let isNewUser = false;

      let customerInfo = await this.authService.getUserInformationByPhoneNumber(
        customerPayload.phoneNumber,
      );

      if (!customerInfo.data) {
        customerInfo = await this.authService.createUser(mentorRole, {
          displayName: customerPayload.displayName,
          email: customerPayload.email,
          phoneNumber: customerPayload.phoneNumber,
        });
        isNewUser = true;
      }

      timeSlot.user = customerInfo.data;
      await this.mentorThreeTimeSlotRepository.save(timeSlot);

      if (timeSlot.creatorEmail) {
        await this.resendService.sendEmail(
          timeSlot.creatorEmail,
          `name od customer:${customerInfo.data.displayName} phone number ${customerInfo.data.phoneNumber}`,
          `<strong>The time slot has been updated.</strong>`,
        );
      }

      return {
        message: isNewUser
          ? `کاربر جدید با موفقیت ایجاد شد و زمان انتخاب‌شده برای او رزرو شد.`
          : `کاربر قبلاً ثبت‌نام کرده بود و زمان موردنظر برای او رزرو شد.`,
        updatedTimeSlot: timeSlot,
      };
    } catch (error) {
      throw new Error(`Failed to update booking: ${error.message}`);
    }
  }
}
