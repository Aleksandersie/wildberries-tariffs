import { Knex } from 'knex';
import { WBWarehouseTariff } from '../types';

const parseNumber = (value: string): number => {
  // Заменяем запятую на точку и преобразуем в число
  return parseFloat(value.replace(',', '.'));
};

export const saveTariffs = async (
  db: Knex,
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

export const getTariffsForDate = async (
  db: Knex,
  date: string
): Promise<any[]> => {
  return db('tariffs')
    .where('date', date)
    .orderBy('warehouse_name')
    .select('*');
}; 