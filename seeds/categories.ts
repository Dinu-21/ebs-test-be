import { Knex } from 'knex';
import IdManager from '../utils/IdManager';

export async function seed(knex: Knex): Promise<void> {
    await knex('categories').del();
    await knex('products').del();

    const parent1 = { id: IdManager.forDB(), label: 'Social', parentId: null };
    const product1 = { id: IdManager.forDB(), label: 'iPhone', categoryId: parent1.id };

    const child = { id: IdManager.forDB(), label: 'Media', parentId: parent1.id };
    const productchild1 = { id: IdManager.forDB(), label: 'mac', categoryId: child.id };
    const productchild2 = { id: IdManager.forDB(), label: 'watch', categoryId: child.id };

    const subChild = { id: IdManager.forDB(), label: 'Diver', parentId: child.id };
    const productsubChild1 = { id: IdManager.forDB(), label: 'house', categoryId: subChild.id };
    const productsubChild2 = { id: IdManager.forDB(), label: 'auto', categoryId: subChild.id };

    const parent2 = { id: IdManager.forDB(), label: 'Politic', parentId: null };

    await knex('categories').insert([parent1, parent2, child, subChild]);
    await knex('products').insert([product1, productchild1, productchild2, productsubChild1, productsubChild2]);
}
