import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';

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
}
