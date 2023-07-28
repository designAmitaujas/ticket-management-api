import { DataSource } from "typeorm";
import { entityPath } from "./constant";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "aa@2021#",
  database: "icai-vadodara",
  synchronize: true,
  logging: false,
  entities: [entityPath],
  subscribers: [],
  migrations: [],
});

// import { DataSource } from "typeorm";
// import { entityPath } from "./constant";

// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: "localhost",
//   username: "amitaujas_icai",
//   password: "amitaujas_icai",
//   database: "amitaujas_icai",
//   synchronize: true,
//   logging: false,
//   entities: [entityPath],
//   subscribers: [],
//   migrations: [],
// });
