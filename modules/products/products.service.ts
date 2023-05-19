import _ from 'lodash';
import IdManager from '../../utils/IdManager';
import Products from './products.model';
import { NotFoundError } from '../../config/errors';
import { TO } from '../../utils/promise';

class ProductsService {
    async getAllProducts() {
        return Products.fetchAll().then(r => r.serialize());
    }

    async getProduct(id: string) {
        const [_, c] = await TO(Products.where('id', id).fetch());

        if (!c) throw new NotFoundError(`Product with id (${id})`);

        return c.serialize();
    }

    async createProduct(categoryId: string, label) {
        return Products.forge({ id: IdManager.forDB(), label, categoryId })
            .save(null, { method: 'insert' })
            .then(r => r.serialize());
    }

    async updateProduct(id: string, categoryId: string | null, label: string) {
        const [_er, c] = await TO(Products.where('id', id).fetch());

        if (!c) throw new NotFoundError(`Product with id (${id})`);

        await c.save({ categoryId, label }, { method: 'update', patch: true });

        return c.serialize();
    }

    async deleteProduct(id: string) {
        const [_, c] = await TO(Products.where('id', id).fetch());

        if (!c) throw new NotFoundError(`Product with id (${id})`);

        await c.destroy();
    }

    async countProductsForCategory(categoryId: string, parentCategoryId: string | null) {
        const num = await Products.where({ categoryId }).count();
        let a: string = '0';

        if (!_.isNull(parentCategoryId)) a = await Products.where({ categoryId: parentCategoryId }).count();

        return parseInt(num) + parseInt(a);
    }
}

export default new ProductsService();
