import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class FrontEndCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(() => FrontEndTimeSlot, (slot) => slot.frontEndCounselingTimes, {
    eager: true,
    cascade: true,
  })
  frontTimeSlots: FrontEndTimeSlot[];
}

@Entity()
export class FrontEndTimeSlot {
  @PrimaryColumn()
  id: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  booked: boolean;

  @Column()
  clock: string;

  @Column({ nullable: true })
  creatorName: string;

  @Column({ nullable: true })
  creatorEmail: string;

  @Column({ nullable: true })
  creatorPhoneNumber: string;

  @ManyToOne(() => User, (user) => user.frontEndTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => FrontEndCounselingTimes, (item) => item.frontTimeSlots, {
    eager: false,
    nullable: true,
  })
  frontEndCounselingTimes: FrontEndCounselingTimes;
}
