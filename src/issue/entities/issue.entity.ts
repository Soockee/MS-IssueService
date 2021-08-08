import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../enum/status';
import { Comment } from './comment.entity';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.OPEN,
  })
  status: Status;

  @Column('uuid')
  projectId: string;

  @OneToMany(() => Comment, (comment) => comment.issue)
  comments: Comment[];
}
