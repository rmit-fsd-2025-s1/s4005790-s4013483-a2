import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roles: string;

  @Column()
  courseCode: string;

  @Column()
  courseName: string;

  @Column()
  outcome: string;

  @Column("text")
  expressionOfInterest: string;

  @Column("text")
  note: string;

  @Column()
  email: string;
}