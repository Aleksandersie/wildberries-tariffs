import dotenv from 'dotenv';
dotenv.config();
import knex from 'knex';
import { Config } from './types';
import { fetchTariffs } from './services/wb-service';
import { saveTariffs } from './services/db-service';
import { updateSheets } from './services/sheets-service';

const config: Config = {
  wb: {
    apiUrl: process.env.WB_API_URL || '',
    updateInterval: parseInt(process.env.UPDATE_INTERVAL || '3600000'),
    token: process.env.WB_SECRET_KEY || ''
  },
  sheets: {
    spreadsheetId: process.env.SHEET_ID || '',
    ranges: ['Sheet1!A:D']
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'wb_tariffs',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'secret'
  }
};

const db = knex({
  client: 'pg',
  connection: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password
  }
});

const updateTariffs = async (): Promise<void> => {
  try {
    console.log(config);
    const tariffs = await fetchTariffs(config.wb.apiUrl);
   
    await saveTariffs(db, tariffs);
   // await updateSheets(tariffs, config.sheets);
    console.log('Tariffs updated successfully');
  } catch (error) {
    console.error('Error in update cycle:', error);
  }
};

const startApp = (): void => {
  updateTariffs();
  setInterval(updateTariffs, config.wb.updateInterval);
};

startApp(); 