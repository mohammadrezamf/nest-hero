import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class MentorOneCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(() => MentorOneTimeSlot, (slot) => slot.mentorOneCounselingTimes, {
    eager: true,
    cascade: true,
  })
  mentorOneTimeSlots: MentorOneTimeSlot[];
}

@Entity()
export class MentorOneTimeSlot {
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

  @ManyToOne(() => User, (user) => user.mentorOneTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(
    () => MentorOneCounselingTimes,
    (item) => item.mentorOneTimeSlots,
    {
      eager: false,
      nullable: true,
    },
  )
  mentorOneCounselingTimes: MentorOneCounselingTimes;
}
