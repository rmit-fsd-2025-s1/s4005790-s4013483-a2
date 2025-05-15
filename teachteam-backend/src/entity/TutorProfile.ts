import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from "typeorm";

@Entity()
export class TutorProfile {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 80 })
  roles: string;

  @Column({ type: "varchar", length: 80 })
  availability: string;

  @Column({ type: "json" })
  skills: string[];

  @Column({ type: "json" })
  credentials: { [key: string]: string };

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}