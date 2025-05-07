import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";

import { Lecturer } from "./Lecturer";

@Entity()
export class LecturerProfile {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 40 })
  age: number;

  @Column({ type: "varchar", length: 256, unique: true })
  contact: string;

  @Column({ type: "varchar", length: 100 })
  biography: string;

  @Column("simple-json")
  links: string[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToOne(() => Lecturer, (lecturer) => lecturer.profile)
  lecturer: Lecturer;
}
