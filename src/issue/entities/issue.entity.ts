import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Issue {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    projectId: string;
}
