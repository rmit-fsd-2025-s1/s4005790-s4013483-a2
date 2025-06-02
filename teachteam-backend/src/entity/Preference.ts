import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Application } from "./Application";
import { Lecturer } from "./Lecturer";

@Entity()
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rank: number;

  @ManyToOne(() => Application, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "applicationId" })
  application: Application;

  @Column()
  applicationId: number;

  @ManyToOne(() => Lecturer, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "lecturerId" })
  lecturer: Lecturer;

  @Column()
  lecturerId: number;

  @Column()
  courseCode: string;
}