import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { File } from '@my-cloud/modules/files/entities/file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
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
