import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class PsychologyCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(
    () => PsychologyTimeSlot,
    (slot) => slot.psychologyCounselingTimes,
    {
      eager: true,
      cascade: true,
    },
  )
  psychologyTimeSlots: PsychologyTimeSlot[];
}

@Entity()
export class PsychologyTimeSlot {
  @PrimaryColumn()
  id: string;

  @Column()
  clock: string;

  @Column({ default: false })
  booked: boolean;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => User, (user) => user.frontEndTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(
    () => PsychologyCounselingTimes,
    (item) => item.psychologyTimeSlots,
    {
      eager: false,
      nullable: true,
    },
  )
  psychologyCounselingTimes: PsychologyCounselingTimes;
}
