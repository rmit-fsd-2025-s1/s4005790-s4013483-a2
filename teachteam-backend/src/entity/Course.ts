import { Entity, Column, PrimaryColumn, ManyToMany } from "typeorm";
import { LecturerProfile } from "./LecturerProfile";

@Entity()
export class Course {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column("json")
  skills: string[];

  @Column("text")
  description: string;

  @ManyToMany(() => LecturerProfile, (lecturerProfile) => lecturerProfile.courses)
  lecturers: LecturerProfile[];
}