import { Injectable } from '@nestjs/common';
import { GeneralCounselingTimes } from './general.model';

@Injectable()
export class GeneralCounselingTimesService {
  private generalCounselingTimes: GeneralCounselingTimes[] = [
    {
      id: '1',
      day: 'saturday',
      time: [
        { active: true, booked: true, clock: '9:00' },
        { active: false, booked: false, clock: '10:00' },
        { active: true, booked: true, clock: '11:00' },
        { active: false, booked: true, clock: '12:00' },
        { active: true, booked: false, clock: '13:00' },
        { active: false, booked: false, clock: '14:00' },
      ],
    },
    {
      id: '2',
      day: 'sunday',
      time: [
        { active: true, booked: true, clock: '9:00' },
        { active: false, booked: false, clock: '10:00' },
        { active: true, booked: true, clock: '11:00' },
        { active: false, booked: true, clock: '12:00' },
        { active: true, booked: false, clock: '13:00' },
        { active: false, booked: false, clock: '14:00' },
      ],
    },
    {
      id: '3',
      day: 'monday',
      time: [
        { active: true, booked: true, clock: '9:00' },
        { active: false, booked: false, clock: '10:00' },
        { active: true, booked: true, clock: '11:00' },
        { active: false, booked: true, clock: '12:00' },
        { active: true, booked: false, clock: '13:00' },
        { active: false, booked: false, clock: '14:00' },
      ],
    },
    {
      id: '4',
      day: 'tuesday',
      time: [
        { active: true, booked: true, clock: '9:00' },
        { active: false, booked: false, clock: '10:00' },
        { active: true, booked: true, clock: '11:00' },
        { active: false, booked: true, clock: '12:00' },
        { active: true, booked: false, clock: '13:00' },
        { active: false, booked: false, clock: '14:00' },
      ],
    },
    {
      id: '5',
      day: 'wednesday',
      time: [
        { active: true, booked: true, clock: '9:00' },
        { active: false, booked: false, clock: '10:00' },
        { active: true, booked: true, clock: '11:00' },
        { active: false, booked: true, clock: '12:00' },
        { active: true, booked: false, clock: '13:00' },
        { active: false, booked: false, clock: '14:00' },
      ],
    },
    {
      id: '6',
      day: 'thursday',
      time: [
        { active: true, booked: true, clock: '9:00' },
        { active: false, booked: false, clock: '10:00' },
        { active: true, booked: true, clock: '11:00' },
        { active: false, booked: true, clock: '12:00' },
        { active: true, booked: false, clock: '13:00' },
        { active: false, booked: false, clock: '14:00' },
      ],
    },
    {
      id: '7',
      day: 'friday',
      time: [
        { active: true, booked: true, clock: '9:00' },
        { active: false, booked: false, clock: '10:00' },
        { active: true, booked: true, clock: '11:00' },
        { active: false, booked: true, clock: '12:00' },
        { active: true, booked: false, clock: '13:00' },
        { active: false, booked: false, clock: '14:00' },
      ],
    },
  ];

  getAllGeneralDay(): GeneralCounselingTimes[] {
    return this.generalCounselingTimes;
  }

  updateActive(
    id: string,
    active: boolean,
    clock: string,
  ): GeneralCounselingTimes | null {
    // Find the counseling time by ID
    const generalCounselingTime = this.generalCounselingTimes.find(
      (item) => item.id === id,
    );

    if (!generalCounselingTime) {
      console.error(`No GeneralCounselingTimes found with id: ${id}`);
      return null; // Return null if not found
    }

    // Find the specific clock
    const time = generalCounselingTime.time.find(
      (item) => item.clock === clock,
    );

    if (!time) {
      console.error(`No clock found with value: ${clock}`);
      return null; // Return null if clock not found
    }

    // Update the active property
    time.active = active;

    // Return the updated GeneralCounselingTimes object
    return generalCounselingTime;
  }
}
