import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './comment.entity';
@Entity()
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('uuid')
  projectId: string;

  @OneToMany(() => Comment, (comment) => comment.issue)
  comments: Comment[];
}
