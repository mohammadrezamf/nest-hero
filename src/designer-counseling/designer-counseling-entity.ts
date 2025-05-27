import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class DesignCounselingTimes {
  @PrimaryColumn()
  id: string;

  @Column()
  day: string;

  @Column({ type: 'date', nullable: false })
  date: string;

  @OneToMany(() => DesignTimeSlot, (slot) => slot.designCounselingTimes, {
    eager: true,
    cascade: true,
  })
  designTimeSlots: DesignTimeSlot[];
}

@Entity()
export class DesignTimeSlot {
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

  @ManyToOne(() => User, (user) => user.designTimeSlots, {
    eager: false,
    nullable: true,
  })
  user: User;

  @ManyToOne(() => DesignCounselingTimes, (item) => item.designTimeSlots, {
    eager: false,
    nullable: true,
  })
  designCounselingTimes: DesignCounselingTimes;
}
