import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class PMCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(() => PMTimeSlot, (slot) => slot.pmCounselingTimes, {
    eager: true,
    cascade: true,
  })
  pmTimeSlots: PMTimeSlot[];
}

@Entity()
export class PMTimeSlot {
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

  @ManyToOne(() => User, (user) => user.pmTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => PMCounselingTimes, (item) => item.pmTimeSlots, {
    eager: false,
    nullable: true,
  })
  pmCounselingTimes: PMCounselingTimes;
}
