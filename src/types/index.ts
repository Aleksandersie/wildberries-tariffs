export type WBWarehouseTariff = {
  warehouseName: string;
  boxDeliveryBase: string;
  boxDeliveryLiter: string;
  boxDeliveryAndStorageExpr: string;
  boxStorageBase: string;
  boxStorageLiter: string;
};

export type WBTariffsResponse = {
  response: {
    data: {
      warehouseList: WBWarehouseTariff[];
    };
  };
};


export type SheetConfig = {
  spreadsheetId: string;
  ranges: string[];
};

export type Config = {
  wb: {
    apiUrl: string;
    updateInterval: number;
    token: string;
  };
  sheets: SheetConfig;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
}; 