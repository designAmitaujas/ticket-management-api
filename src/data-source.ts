// import { DataSource } from "typeorm";
// import { entityPath } from "./constant";

// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: "localhost",
//   username: "posdelta_db",
//   password: "posdelta_db",
//   database: "posdelta_db",
//   synchronize: true,
//   logging: false,
//   entities: [entityPath],
//   subscribers: [],
//   migrations: [],
// });

import { DataSource } from "typeorm";
import { entityPath } from "./constant";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Bhavya",
  database: "ticket-management",
  synchronize: true,
  logging: false,
  entities: [entityPath],
  subscribers: [],
  migrations: [],
});
