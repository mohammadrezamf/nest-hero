import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class GeneralCounselingTimes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  day: string;

  @OneToMany(() => CounselingTimeSlot, (slot) => slot.generalCounselingTimes, {
    eager: true,
    cascade: true,
  })
  timeSlots: CounselingTimeSlot[];
}

@Entity()
export class CounselingTimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clock: string;

  @Column({ default: false })
  booked: boolean;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => User, (user) => user.counselingTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => GeneralCounselingTimes, (general) => general.timeSlots, {
    eager: false,
    nullable: true,
  })
  generalCounselingTimes: GeneralCounselingTimes;
}
