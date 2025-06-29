import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class MentorThreeCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(
    () => MentorThreeTimeSlot,
    (slot) => slot.mentorThreeCounselingTimes,
    {
      eager: true,
      cascade: true,
    },
  )
  mentorThreeTimeSlots: MentorThreeTimeSlot[];
}

@Entity()
export class MentorThreeTimeSlot {
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

  @ManyToOne(() => User, (user) => user.mentorThreeTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(
    () => MentorThreeCounselingTimes,
    (item) => item.mentorThreeTimeSlots,
    {
      eager: false,
      nullable: true,
    },
  )
  mentorThreeCounselingTimes: MentorThreeCounselingTimes;
}
