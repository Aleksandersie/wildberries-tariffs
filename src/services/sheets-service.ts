import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { WBWarehouseTariff } from "../types";

const tabsIds = ["1ODWYdBWya9ME31GWJU32RvZ3U3Z5A8OXA43H48JHoAw"];

const getAuthClient = async (): Promise<OAuth2Client> => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth.getClient() as Promise<OAuth2Client>;
};

export const updateSheets = async (
  tariffs: WBWarehouseTariff[],
  spreadsheetId: string,
  sheetName: string = "stocks_coefs"
): Promise<void> => {
  tabsIds.forEach(async (tabId) => {
    try {
      console.log("Starting sheet update...");
      const auth = await getAuthClient();
      const sheets = google.sheets({ version: "v4", auth });

      const range = `${sheetName}!A:G`;

      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: tabId,
      });

      const sheet = spreadsheet.data.sheets?.[0];


      const values = [
        [
          "Дата",
          "Склад",
          "Доставка и хранение",
          "Доставка (база)",
          "Доставка (литр)",
          "Хранение (база)",
          "Хранение (литр)",
        ],

        ...tariffs.map((t) => [
          new Date().toISOString().split("T")[0],
          t.warehouseName,
          t.boxDeliveryAndStorageExpr.replace(",", "."),
          t.boxDeliveryBase.replace(",", "."),
          t.boxDeliveryLiter.replace(",", "."),
          t.boxStorageBase.replace(",", "."),
          t.boxStorageLiter.replace(",", "."),
        ]),
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: tabId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: tabId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: sheet?.properties?.sheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 7
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.8, green: 0.8, blue: 0.8 },
                    textFormat: { 
                      bold: true,
                      fontSize: 11
                    },
                    horizontalAlignment: 'CENTER',
                    verticalAlignment: 'MIDDLE',
                    padding: {
                      top: 8,
                      right: 8,
                      bottom: 8,
                      left: 8
                    },
                    wrapStrategy: 'WRAP'
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,padding,wrapStrategy)'
              }
            },
            {
              repeatCell: {
                range: {
                  sheetId: sheet?.properties?.sheetId,
                  startRowIndex: 1,
                  startColumnIndex: 0,
                  endColumnIndex: 7
                },
                cell: {
                  userEnteredFormat: {
                    horizontalAlignment: 'CENTER',
                    verticalAlignment: 'MIDDLE',
                    padding: {
                      top: 4,
                      right: 4,
                      bottom: 4,
                      left: 4
                    }
                  }
                },
                fields: 'userEnteredFormat(horizontalAlignment,verticalAlignment,padding)'
              }
            },
            {
              updateDimensionProperties: {
                range: {
                  sheetId: sheet?.properties?.sheetId,
                  dimension: 'COLUMNS',
                  startIndex: 0,
                  endIndex: 1
                },
                properties: {
                  pixelSize: 120
                },
                fields: 'pixelSize'
              }
            },
            {
              updateDimensionProperties: {
                range: {
                  sheetId: sheet?.properties?.sheetId,
                  dimension: 'COLUMNS',
                  startIndex: 1,
                  endIndex: 2
                },
                properties: {
                  pixelSize: 250
                },
                fields: 'pixelSize'
              }
            },
            {
              updateDimensionProperties: {
                range: {
                  sheetId: sheet?.properties?.sheetId,
                  dimension: 'COLUMNS',
                  startIndex: 2,
                  endIndex: 7
                },
                properties: {
                  pixelSize: 150 
                },
                fields: 'pixelSize'
              }
            },
            {
              sortRange: {
                range: {
                  sheetId: sheet?.properties?.sheetId,
                  startRowIndex: 1,
                  endRowIndex: values.length,
                  startColumnIndex: 0,
                  endColumnIndex: 7
                },
                sortSpecs: [
                  {
                    dimensionIndex: 2,
                    sortOrder: 'ASCENDING'
                  }
                ]
              }
            }
          ]
        }
      });

      console.log("Sheet updated successfully");
    } catch (error) {
      console.error("Error updating sheet:", {
        message: "error.message",
        status: "error.status",
        code: "error.code",
      });
      throw error;
    }
  });
};
