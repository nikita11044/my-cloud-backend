import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@my-cloud/modules/users/entities/user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  originalName: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @ManyToOne(() => User, (user) => user.files)
  user: User;

  @DeleteDateColumn()
  deletedAt?: Date;
}
