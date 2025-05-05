import "reflect-metadata";
import { DataSource } from "typeorm";
import { Lecturer } from "./entity/Lecturer";
import { Tutor } from "./entity/Tutor";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "209.38.26.237",
  port: 3306,
  username: "S4013483",
  password: "4z7&j$y0*0p9#9o0N0UQg2YQ@s!!qade33lKt0q&Xaoi@Ob5l7",
  database: "S4013483",
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true,
  logging: true,
  entities: [Lecturer, Tutor],
  migrations: [],
  subscribers: [],
});
