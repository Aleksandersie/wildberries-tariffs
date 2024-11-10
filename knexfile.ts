import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5440'),
    database: process.env.DB_NAME || 'wb_tariffs',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'secret'
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/migrations'
  }
};

export default config; 