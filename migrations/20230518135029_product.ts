import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', function (table) {
        table.string('id').unique().primary();
        table.string('categoryId').defaultTo(null);
        table.string('label', 256).defaultTo('');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('products');
}
