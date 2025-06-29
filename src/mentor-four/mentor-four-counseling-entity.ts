import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class MentorFourCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(
    () => MentorFourTimeSlot,
    (slot) => slot.mentorFourCounselingTimes,
    {
      eager: true,
      cascade: true,
    },
  )
  mentorFourTimeSlots: MentorFourTimeSlot[];
}

@Entity()
export class MentorFourTimeSlot {
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

  @ManyToOne(() => User, (user) => user.mentorFourTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(
    () => MentorFourCounselingTimes,
    (item) => item.mentorFourTimeSlots,
    {
      eager: false,
      nullable: true,
    },
  )
  mentorFourCounselingTimes: MentorFourCounselingTimes;
}
