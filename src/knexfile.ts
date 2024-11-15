import type { Knex } from "knex";


const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5450"),
    user: process.env.DB_USER || "wb_user",
    password: process.env.DB_PASSWORD || "wb_password",
    database: process.env.DB_NAME || "wb_tariffs",
  },
  migrations: {
    directory: "./migrations",
    extension: "ts",
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export default config; 