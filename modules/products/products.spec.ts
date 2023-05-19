import { expect } from 'chai';
import { TO } from '../../utils/promise';
import productsTestingUtils from '../../test/utils/products';
import categoriesTestingUtils from '../../test/utils/categories';
import productsService from './products.service';

import Sinon, { SinonStub } from 'sinon';
import IdManager from '../../utils/IdManager';
import Products from './products.model';
import { NotFoundError } from '../../config/errors';

describe('Test categories service', () => {
    describe('and the method getAllProducts', () => {
        afterEach(async () => {
            await productsTestingUtils.clear();
        });

        it('should return all categories', async () => {
            const items = [await productsTestingUtils.create(), await productsTestingUtils.create()];

            const [error, result] = await TO(productsService.getAllProducts());

            expect(error).to.be.null;
            expect(result).to.be.deep.equal(items);
        });
    });

    describe('and the method createProduct', () => {
        const ID_MOCK = 'uhjkda212eads';
        const CATEGORY_ID_MOCK = 'ajkdasf';
        const LABEL_MOCK = 'label';
        let stubId: SinonStub;

        beforeEach(() => {
            stubId = Sinon.stub(IdManager, 'forDB').returns(ID_MOCK);
        });
        afterEach(async () => {
            await productsTestingUtils.clear();
            stubId.restore();
        });

        it('should create a product with provided fields', async () => {
            const [error, result] = await TO(productsService.createProduct(CATEGORY_ID_MOCK, LABEL_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({ id: ID_MOCK, label: LABEL_MOCK, categoryId: CATEGORY_ID_MOCK });
        });
    });

    describe('and the method getProduct', () => {
        const INEXISTENT_ID_MOCK = 'uadadasdas';
        const ID_MOCK = 'uadad';
        const CATEGORY_ID_MOCK = 'adja712';
        const LABEL_MOCK = 'Label for category';
        beforeEach(async () => {
            await productsTestingUtils.create({ id: ID_MOCK, label: LABEL_MOCK, categoryId: CATEGORY_ID_MOCK });
        });

        afterEach(async () => {
            await productsTestingUtils.clear();
        });

        it('should throw error if not found', async () => {
            const [error] = await TO(productsService.getProduct(INEXISTENT_ID_MOCK));
            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should return the product', async () => {
            const [error, result] = await TO(productsService.getProduct(ID_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({ id: ID_MOCK, categoryId: CATEGORY_ID_MOCK, label: LABEL_MOCK });
        });
    });

    describe('and the method updateProduct', () => {
        const INEXISTENT_ID_MOCK = 'uadadasdas';
        const ID_MOCK = 'uadad';
        const CATEGORY_ID_MOCK = 'adja712';
        const LABEL_MOCK = 'Label for product';

        beforeEach(async () => {
            await productsTestingUtils.create({ id: ID_MOCK });
        });

        afterEach(async () => {
            await productsTestingUtils.clear();
        });

        it('should throw error if not found', async () => {
            const [error] = await TO(productsService.updateProduct(INEXISTENT_ID_MOCK, CATEGORY_ID_MOCK, LABEL_MOCK));
            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should update the fields', async () => {
            const [error, result] = await TO(productsService.updateProduct(ID_MOCK, CATEGORY_ID_MOCK, LABEL_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({ id: ID_MOCK, categoryId: CATEGORY_ID_MOCK, label: LABEL_MOCK });
        });
    });

    describe('and the method deleteCategory', () => {
        const INEXISTENT_ID_MOCK = 'uadadasdas';
        const ID_MOCK = 'uadad';

        beforeEach(async () => {
            await productsTestingUtils.create({ id: ID_MOCK });
        });

        afterEach(async () => {
            await productsTestingUtils.clear();
        });

        it('should throw error if not found', async () => {
            const [error] = await TO(productsService.deleteProduct(INEXISTENT_ID_MOCK));
            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should remove row', async () => {
            const [error] = await TO(productsService.deleteProduct(ID_MOCK));

            expect(error).to.be.null;
            const c = await Products.where('id', ID_MOCK)
                .fetch()
                .catch(e => null);
            expect(c).to.be.null;
        });
    });

    describe('and the method countProductsForCategory', () => {
        const PARENT_ID_MOCK = 'parent';
        const CHILD_ID_MOCK = 'child';
        const PARENT_ID_2_MOCK = 'parent2';
        const CHILD_ID_2_MOCK = 'child2';
        const PARENT_ID_3_MOCK = 'parent3';
        const MISSING_PARENT_ID_MOCK = null;

        beforeEach(async () => {
            await categoriesTestingUtils.create({ id: PARENT_ID_MOCK });
            await categoriesTestingUtils.create({ id: CHILD_ID_MOCK, parentId: PARENT_ID_MOCK });

            await productsTestingUtils.create({ categoryId: PARENT_ID_MOCK });
            await productsTestingUtils.create({ categoryId: PARENT_ID_MOCK });
            await productsTestingUtils.create({ categoryId: CHILD_ID_MOCK });

            await categoriesTestingUtils.create({ id: PARENT_ID_2_MOCK });
            await categoriesTestingUtils.create({ id: CHILD_ID_2_MOCK, parentId: PARENT_ID_2_MOCK });

            await productsTestingUtils.create({ categoryId: CHILD_ID_2_MOCK });
        });

        afterEach(async () => {
            await categoriesTestingUtils.clear();
            await productsTestingUtils.clear();
        });

        it('should count the products from its category and parent category', async () => {
            const [error, result] = await TO(productsService.countProductsForCategory(CHILD_ID_MOCK, PARENT_ID_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.equal(3);
        });

        it('should count the products from its category and parent category when parent does not have any products', async () => {
            const [error, result] = await TO(
                productsService.countProductsForCategory(CHILD_ID_2_MOCK, PARENT_ID_2_MOCK)
            );

            expect(error).to.be.null;
            expect(result).to.be.equal(1);
        });

        it('should count the products from its category and parent category when parent id is wrong', async () => {
            const [error, result] = await TO(
                productsService.countProductsForCategory(CHILD_ID_2_MOCK, PARENT_ID_3_MOCK)
            );

            expect(error).to.be.null;
            expect(result).to.be.equal(1);
        });

        it('should count the products only from its category when parent category is missing', async () => {
            const [error, result] = await TO(
                productsService.countProductsForCategory(CHILD_ID_MOCK, MISSING_PARENT_ID_MOCK)
            );

            expect(error).to.be.null;
            expect(result).to.be.equal(1);
        });
    });
});
