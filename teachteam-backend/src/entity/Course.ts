import { Entity, Column, PrimaryColumn } from "typeorm";

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
}