import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Workshop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column({ default: false })
  isFree: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', nullable: true })
  price: number;

  @Column()
  mentorName: string;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @Column({ nullable: true })
  phoneNumber: string;

  @ManyToMany(() => User, (user) => user.workshops)
  @JoinTable() // Defines the join table for the many-to-many relationship
  users: User[];
}
