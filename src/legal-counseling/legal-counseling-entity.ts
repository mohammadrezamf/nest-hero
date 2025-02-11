import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class LegalCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(() => LegalTimeSlot, (slot) => slot.legalCounselingTimes, {
    eager: true,
    cascade: true,
  })
  legalTimeSlots: LegalTimeSlot[];
}

@Entity()
export class LegalTimeSlot {
  @PrimaryColumn()
  id: string;

  @Column()
  clock: string;

  @Column({ default: false })
  booked: boolean;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => User, (user) => user.legalTimeSlot, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => LegalCounselingTimes, (item) => item.legalTimeSlots, {
    eager: false,
    nullable: true,
  })
  legalCounselingTimes: LegalCounselingTimes;
}
