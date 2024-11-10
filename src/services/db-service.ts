import { knex,Knex } from 'knex';
import { WBWarehouseTariff } from '../types';
import config from '../knexfile';   

const parseNumber = (value: string): number => {
  return parseFloat(value.replace(',', '.'));
};


const db: Knex = knex(config);
export const saveTariffs = async (

  tariff: WBWarehouseTariff[]
): Promise<void> => {
  try {
    tariff.forEach(async tariff => {
    await db('tariffs').insert({
      date: new Date().toISOString().split('T')[0],
      warehouse_name: tariff.warehouseName,
      delivery_base: parseNumber(tariff.boxDeliveryBase),
      delivery_liter: parseNumber(tariff.boxDeliveryLiter),
      box_delivery_and_storage_expr: parseNumber(tariff.boxDeliveryAndStorageExpr),
      storage_base: parseNumber(tariff.boxStorageBase),
      storage_liter: parseNumber(tariff.boxStorageLiter)
      });
    });
  } catch (error) {
    console.error('Error saving tariff:', error);
    throw error;
  }
};

