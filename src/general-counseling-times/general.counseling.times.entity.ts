import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class GeneralCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false }) // Add this field
  date: string;

  @OneToMany(() => CounselingTimeSlot, (slot) => slot.generalCounselingTimes, {
    eager: true,
    cascade: true,
  })
  timeSlots: CounselingTimeSlot[];
}

@Entity()
export class CounselingTimeSlot {
  @PrimaryColumn()
  id: string;

  @Column()
  clock: string;

  @Column({ default: false })
  booked: boolean;

  @Column({ default: false })
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
