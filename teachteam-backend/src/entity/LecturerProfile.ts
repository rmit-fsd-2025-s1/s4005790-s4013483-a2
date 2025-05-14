import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinTable,
  ManyToMany,
} from "typeorm";

import { Lecturer } from "./Lecturer";
import { Course } from "./Course";

@Entity()
export class LecturerProfile {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "int", default: 0 })
  age: number;

  @Column({ type: "varchar", length: 100 })
  contact: string;

  @Column({ type: "varchar", length: 1000 })
  biography: string;

  @Column({ type: "varchar", length: 1000 })
  links: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToOne(() => Lecturer, (lecturer) => lecturer.profile)
  lecturer: Lecturer;

  @ManyToMany(() => Course, (course) => course.lecturers)
  @JoinTable()
  courses: Course[];  
}
