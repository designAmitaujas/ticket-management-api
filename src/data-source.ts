import { DataSource } from "typeorm";
import { entityPath } from "./constant";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "aa@2021#",
  database: "ticket-management",
  synchronize: true,
  logging: false,
  entities: [entityPath],
  subscribers: [],
  migrations: [],
});
