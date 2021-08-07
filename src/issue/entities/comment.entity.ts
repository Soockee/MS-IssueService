import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Issue } from './issue.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column('uuid')
  authorId: string;

  @ManyToOne(() => Issue, (issue) => issue.comments)
  issue: Issue;
}
