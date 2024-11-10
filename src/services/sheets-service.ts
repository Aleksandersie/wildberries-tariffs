import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { WBWarehouseTariff } from '../types';

const getAuthClient = async (): Promise<OAuth2Client> => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return auth.getClient() as Promise<OAuth2Client>;
};

export const updateSheets = async (
  tariffs: WBWarehouseTariff[],
  spreadsheetId: string,
  sheetName: string = 'Тарифы'
): Promise<void> => {
  try {
    console.log('Starting sheet update...');
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    const range = `${sheetName}!A:G`;

    const values = [

      ['Дата', 'Склад', 'Доставка и хранение', 'Доставка (база)', 'Доставка (литр)', 'Хранение (база)', 'Хранение (литр)'],
  
      ...tariffs.map(t => [
        new Date().toISOString().split('T')[0],
        t.warehouseName,
        t.boxDeliveryAndStorageExpr.replace(',', '.'),
        t.boxDeliveryBase.replace(',', '.'),
        t.boxDeliveryLiter.replace(',', '.'),
        t.boxStorageBase.replace(',', '.'),
        t.boxStorageLiter.replace(',', '.')
      ])
    ];

    
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });

  
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });

    console.log('Sheet updated successfully');
  } catch (error) {
    console.error('Error updating sheet:', {
      message: "error.message",
      status: "error.status",
      code: "error.code"
    });
    throw error;
  }
};

