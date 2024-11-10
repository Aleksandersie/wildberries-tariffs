import axios from 'axios';
import { WBTariffsResponse, WBWarehouseTariff } from '../types';

const formatTariff = (tariff: WBWarehouseTariff) => ({
  date: new Date().toISOString().split('T')[0],
  warehouse: tariff.warehouseName,
  delivery: {
    base: parseFloat(tariff.boxDeliveryBase),
    liter: parseFloat(tariff.boxDeliveryLiter.replace(',', '.')),
    total: parseFloat(tariff.boxDeliveryAndStorageExpr)
  },
  storage: {
    base: parseFloat(tariff.boxStorageBase),
    liter: parseFloat(tariff.boxStorageLiter.replace(',', '.'))
  }
});

export const fetchTariffs = async (apiUrl: string): Promise<WBWarehouseTariff[]> => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const { data } = await axios.get<WBTariffsResponse>(
      `https://common-api.wildberries.ru/api/v1/tariffs/box`,
      {
        params: { date },
        headers: {
          'Authorization': process.env.WB_SECRET_KEY
        }
      }
    );
    
    return data.response.data.warehouseList.map((warehouse): WBWarehouseTariff => ({
      warehouseName: warehouse.warehouseName,
      boxDeliveryAndStorageExpr: warehouse.boxDeliveryAndStorageExpr,
      boxDeliveryBase: warehouse.boxDeliveryAndStorageExpr,
      boxDeliveryLiter: warehouse.boxDeliveryLiter,
      boxStorageBase: warehouse.boxStorageBase,
      boxStorageLiter: warehouse.boxStorageLiter
    }));
  } catch (error) {
    console.error('Error fetching WB tariffs:', error);
    return [];
  }
}; 