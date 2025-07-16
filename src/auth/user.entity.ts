import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';
import { UserRole } from './dto/auth-credential.dto';
import { MentorOneTimeSlot } from '../mentor-one/mentor-one-counseling-entity';
import { FileEntity } from '../file/file.entity';
import { MentorTwoTimeSlot } from '../mentor-two/mentor-two-counseling-entity';
import { MentorThreeTimeSlot } from '../mentor-three/mentor-three-counseling-entity';
import { MentorFourTimeSlot } from '../mentor-four/mentor-four-counseling-entity';
import { Workshop } from '../workshop/workshop.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // Default role
  })
  role: UserRole;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpExpiration: Date;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  email: string;

  // ---------------- other tables ---------------
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToMany(() => CounselingTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  counselingTimeSlots: CounselingTimeSlot[];

  @OneToMany(() => MentorOneTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  mentorOneTimeSlots: MentorOneTimeSlot[];

  @OneToMany(() => MentorTwoTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  mentorTwoTimeSlots: MentorTwoTimeSlot[];

  @OneToMany(() => MentorThreeTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  mentorThreeTimeSlots: MentorThreeTimeSlot[];

  @OneToMany(() => MentorFourTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  mentorFourTimeSlots: MentorFourTimeSlot[];

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];

  @ManyToMany(() => Workshop, (workshop) => workshop.users)
  workshops: Workshop[];
}
