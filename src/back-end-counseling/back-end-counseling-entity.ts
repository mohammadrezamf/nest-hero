import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class BackEndCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(() => BackEndTimeSlot, (slot) => slot.backEndCounselingTimes, {
    eager: true,
    cascade: true,
  })
  backEndTimeSlots: BackEndTimeSlot[];
}

@Entity()
export class BackEndTimeSlot {
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

  @ManyToOne(() => User, (user) => user.backEndTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => BackEndCounselingTimes, (item) => item.backEndTimeSlots, {
    eager: false,
    nullable: true,
  })
  backEndCounselingTimes: BackEndCounselingTimes;
}
