import dotenv from 'dotenv';
import { Config } from './types';
import { fetchTariffs } from './services/wb-service';
import { updateSheets } from './services/sheets-service';
import { saveTariffs } from './services/db-service';
dotenv.config();




const appConfig: Config = {
  wb: {
    apiUrl: process.env.WB_API_URL || '',
    updateInterval: parseInt(process.env.UPDATE_INTERVAL || '3600000'),
    token: process.env.WB_SECRET_KEY || ''
  },
  sheets: {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
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



const updateTariffs = async (): Promise<void> => {
  try {
    const tariffs = await fetchTariffs();
    await saveTariffs( tariffs);
    await updateSheets(tariffs, process.env.GOOGLE_SPREADSHEET_ID || '');
  } catch (error) {
    console.error('Error:', error);
  }
};

const startApp = (): void => {
  updateTariffs();
  setInterval(updateTariffs, appConfig.wb.updateInterval);
};

startApp(); 