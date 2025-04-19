import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { CounselingTimeSlot } from '../general-counseling-times/general.counseling.times.entity';
import { UserRole } from './dto/auth-credential.dto';
import { FrontEndTimeSlot } from '../front-end-counseling/front-end-counseling-entity';
import { PsychologyTimeSlot } from '../psychology-counseling/psychoogy-counseling-entity';
import { LegalTimeSlot } from '../legal-counseling/legal-counseling-entity';
import { UploadFile } from '../upload/pload.entity';

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

  @OneToMany(() => LegalTimeSlot, (slot) => slot.user, {
    eager: true,
    nullable: true,
  })
  legalTimeSlot: LegalTimeSlot[];

  @OneToMany(() => UploadFile, (file) => file.uploader)
  uploadedFiles: UploadFile[];
}
