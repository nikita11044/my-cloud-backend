import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { File } from '../../files';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName?: string;

  @OneToMany(() => File, (file) => file.user)
  files: File[];
}
