import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class SecurityCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(() => SecurityTimeSlot, (slot) => slot.securityCounselingTimes, {
    eager: true,
    cascade: true,
  })
  securityTimeSlots: SecurityTimeSlot[];
}

@Entity()
export class SecurityTimeSlot {
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

  @ManyToOne(() => User, (user) => user.securityTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => SecurityCounselingTimes, (item) => item.securityTimeSlots, {
    eager: false,
    nullable: true,
  })
  securityCounselingTimes: SecurityCounselingTimes;
}
