import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';
import { UserRole } from './dto/auth-credential.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToMany(() => CounselingTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  counselingTimeSlots: CounselingTimeSlot[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // Default role
  })
  role: UserRole;
}
