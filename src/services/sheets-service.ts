import { google, sheets_v4 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { WBTariff, SheetConfig } from '../types';

const getAuthClient = async (): Promise<OAuth2Client> => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return auth.getClient() as Promise<OAuth2Client>;
};

const formatTariffsForSheet = (tariffs: WBTariff[]): string[][] =>
  tariffs.map(tariff => [
    tariff.date,
    tariff.warehouse,
    tariff.price.toString(),
    `${tariff.dimensions.length}x${tariff.dimensions.width}x${tariff.dimensions.height}`
  ]);

export const updateSheets = async (
  tariffs: WBTariff[],
  config: SheetConfig
): Promise<void> => {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ 
      version: 'v4', 
      auth 
    }) as sheets_v4.Sheets;
    
    const values = formatTariffsForSheet(tariffs);
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.spreadsheetId,
      range: config.ranges[0],
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
  } catch (error) {
    console.error('Error updating sheets:', error);
    throw error;
  }
}; 