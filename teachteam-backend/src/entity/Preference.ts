import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  preference_rank: number;

  @Column()
  applicationId: number;

  @Column()
  lecturerId: number;

  @Column()
  courseCode: string;

  @Column()
  role: string; 
}