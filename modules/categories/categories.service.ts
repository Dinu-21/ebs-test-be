import _ from 'lodash';
import IdManager from '../../utils/IdManager';
import Categories from './categories.model';
import { ConflictError, NotFoundError } from '../../config/errors';
import productsService from '../products/products.service';

class CategoriesService {
    async getAllCategories() {
        return await Categories.where('parentId', null)
            .fetchAll()
            .then(r => r.serialize())
            .then(categories => Promise.all(categories.map(enrichWithChildrenAndProductsCount)))
            .catch(() => []);

        async function enrichWithChildrenAndProductsCount(category) {
            const children = await Categories.where('parentId', category.id)
                .fetchAll()
                .then(r => r.serialize())
                .then(categories => Promise.all(categories.map(enrichWithChildrenAndProductsCount)))
                .catch(() => []);

            category.children = children;
            category.productsCount = await productsService.countProductsForCategory(category.id, category.parentId);

            return category;
        }
    }

    async getCategory(id: string) {
        const category = await Categories.where('id', id)
            .fetch()
            .then(r => r.serialize())
            .catch(() => null);

        if (!category) throw new NotFoundError(`Category with id (${id})`);

        return category;
    }

    async createCategory(parentId: null | string, label: string) {
        const duplicate = await Categories.where({ label })
            .fetch()
            .catch(e => null);
        
        if (duplicate)
            throw new ConflictError(`There is already a category with that label. Duplicates is not allowed`);

        if (!_.isNull(parentId)) {
            const parentCategory = await Categories.where({ id: parentId })
                .fetch()
                .catch(e => null);

            if (!parentCategory) throw new NotFoundError(`A parent category with id (${parentId})`);
        }

        return await Categories.forge({ id: IdManager.forDB(), label, parentId })
            .save(null, { method: 'insert' })
            .then(r => r.serialize());
    }

    async updateCategory(id: string, parentId: string | null, label: string) {
        const category = await Categories.where('id', id)
            .fetch()
            .catch(() => null);

        if (!category) throw new NotFoundError(`Category with id (${id})`);

        const serialized = category.serialize();

        if (!_.isEmpty(label) && !_.isEqual(serialized.label, label)) {
            const categoryWithSameLabel = await Categories.where('label', label)
                .fetch()
                .then(r => r.serialize())
                .catch(() => null);

            if (categoryWithSameLabel) throw new ConflictError(`Category with label (${label}) already exists`);
        }

        if (_.isEqual(id, parentId)) throw new ConflictError(`Assigning category to self is not allowed`);

        if (!_.isNull(parentId)) {
            const parentCategory = await Categories.where('id', parentId)
                .fetch()
                .then(r => r.serialize())
                .catch(() => null);

            if (!parentCategory) throw new NotFoundError(`A parent category with id (${parentId})`);

            if (parentCategory.parentId === category.id)
                throw new ConflictError(`Circular assigning of categories is not allowed`);
        }

        await category.save({ parentId, label }, { method: 'update', patch: true });

        return category.serialize();
    }

    async deleteCategory(id: string) {
        const category = await Categories.where('id', id)
            .fetch()
            .catch(() => null);

        if (!category) throw new NotFoundError(`Category with id (${id})`);

        await category.destroy();
    }
}

export default new CategoriesService();
