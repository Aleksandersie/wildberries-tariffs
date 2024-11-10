import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tariffs', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.string('warehouse_name').notNullable();
    
    table.decimal( 'box_delivery_and_storage_expr', 10, 2)
    // Доставка
    table.decimal('delivery_base', 10, 2).notNullable();
    table.float('delivery_liter', 10, 2).notNullable();
  
    // Хранение
    table.float('storage_base', 10, 2).notNullable();
    table.float('storage_liter', 10, 2).notNullable();
    
    // Метаданные
    table.timestamp('created_at').defaultTo(knex.fn.now());

 
    
    // Индекс для быстрого поиска по дате
    table.index('date');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tariffs');
} 