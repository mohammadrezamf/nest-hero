import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../auth/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne((_type) => User, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
