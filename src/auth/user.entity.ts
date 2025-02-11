import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';
import { UserRole } from './dto/auth-credential.dto';
import { FrontEndTimeSlot } from '../front-end-counseling/front-end-counseling-entity';
import { PsychologyTimeSlot } from '../psychology-counseling/psychoogy-counseling-entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // Default role
  })
  role: UserRole;
  // ---------------- other tables ---------------
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToMany(() => CounselingTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  counselingTimeSlots: CounselingTimeSlot[];

  @OneToMany(() => FrontEndTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  frontEndTimeSlots: FrontEndTimeSlot[];

  @OneToMany(() => PsychologyTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  psychologyTimeSlot: PsychologyTimeSlot[];
}
