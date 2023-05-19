import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('categories', function(table) {
        table.string('id').unique().primary();
        table.string('parentId').defaultTo(null);
        table.string('label', 128);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('categories');
}
