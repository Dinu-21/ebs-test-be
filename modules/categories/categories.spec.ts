import { expect } from 'chai';
import { TO } from '../../utils/promise';
import categoriesTestingUtils from '../../test/utils/categories';
import categoriesService from './categories.service';

import Sinon, { SinonStub } from 'sinon';
import IdManager from '../../utils/IdManager';
import Categories from './categories.model';
import { ConflictError, NotFoundError } from '../../config/errors';
import productsService from '../products/products.service';

describe('Test categories service', () => {
    describe('and the method getAllCategories', () => {
        const PRODUCTS_COUNT_MOCK = 10;

        let stubProductCount: SinonStub;

        beforeEach(() => {
            stubProductCount = Sinon.stub(productsService, 'countProductsForCategory').resolves(PRODUCTS_COUNT_MOCK);
        });

        afterEach(async () => {
            await categoriesTestingUtils.clear();
            stubProductCount.restore();
        });

        it('should return all categories in a tree like structure', async () => {
            const [PARENT_MOCK, PARENT_2_MOCK] = ['asdada', 'bfmbaa'];
            const [CHILD_MOCK, CHILD_2_MOCK] = ['child_asdada', 'chlid_bfmbaa'];
            const [SUB_CHILD_MOCK, SUB_CHILD_2_MOCK] = ['sub_child_asdada', 'sub_chlid_bfmbaa'];

            const parent = await categoriesTestingUtils.create({ id: PARENT_MOCK });
            const parent_children = await categoriesTestingUtils.create({ id: CHILD_MOCK, parentId: PARENT_MOCK });

            const parent2 = await categoriesTestingUtils.create({ id: PARENT_2_MOCK });
            const parent2_child = await categoriesTestingUtils.create({ id: CHILD_2_MOCK, parentId: PARENT_2_MOCK });
            const parent2_sub_child = await categoriesTestingUtils.create({
                id: SUB_CHILD_MOCK,
                parentId: CHILD_2_MOCK,
            });
            const parent2_sub_child2 = await categoriesTestingUtils.create({
                id: SUB_CHILD_2_MOCK,
                parentId: CHILD_2_MOCK,
            });

            const [error, result] = await TO(categoriesService.getAllCategories());

            expect(error).to.be.null;
            expect(result).to.be.deep.equal([
                {
                    ...parent,
                    productsCount: PRODUCTS_COUNT_MOCK,
                    children: [{ ...parent_children, productsCount: PRODUCTS_COUNT_MOCK, children: [] }],
                },
                {
                    ...parent2,
                    productsCount: PRODUCTS_COUNT_MOCK,
                    children: [
                        {
                            ...parent2_child,
                            productsCount: PRODUCTS_COUNT_MOCK,
                            children: [
                                { ...parent2_sub_child, productsCount: PRODUCTS_COUNT_MOCK, children: [] },
                                { ...parent2_sub_child2, productsCount: PRODUCTS_COUNT_MOCK, children: [] },
                            ],
                        },
                    ],
                },
            ]);
        });
    });

    describe('and the method getCategory', () => {
        const INEXISTENT_ID_MOCK = 'uadadasdas';
        const ID_MOCK = 'uadad';
        const PARENT_ID_MOCK = 'adja712';
        const LABEL_MOCK = 'Label for category';

        beforeEach(async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK, label: LABEL_MOCK, parentId: PARENT_ID_MOCK });
        });

        afterEach(async () => {
            await categoriesTestingUtils.clear();
        });

        it('should throw error if not found', async () => {
            const [error] = await TO(categoriesService.getCategory(INEXISTENT_ID_MOCK));
            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should return the catgory with products count', async () => {
            const [error, result] = await TO(categoriesService.getCategory(ID_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({
                id: ID_MOCK,
                parentId: PARENT_ID_MOCK,
                label: LABEL_MOCK,
                // productsCount: PRODUCTS_COUNT_MOCK,
            });
        });
    });

    describe('and the method createCategory', () => {
        const ID_MOCK = 'uhjkda2141312eads';
        const PARENT_CATEGORY_MOCK = 'uhjkda212eads';

        const INEXISTENT_CATEGORY_ID_MOCK = 'uhjafakda212eads';
        const LABEL_MOCK = 'jaasdahdadds';
        const DUPLICATED_LABEL_MOCK = 'jahdadds';
        let stubId: SinonStub;

        beforeEach(async () => {
            await categoriesTestingUtils.create({ id: PARENT_CATEGORY_MOCK });
            await categoriesTestingUtils.create({ label: DUPLICATED_LABEL_MOCK });

            stubId = Sinon.stub(IdManager, 'forDB').returns(ID_MOCK);
        });
        afterEach(async () => {
            await categoriesTestingUtils.clear();
            stubId.restore();
        });

        it('should throw error if label is duplicated', async () => {
            const [error] = await TO(categoriesService.createCategory(PARENT_CATEGORY_MOCK, DUPLICATED_LABEL_MOCK));

            expect(error).to.be.instanceOf(ConflictError);
        });

        it('should throw error if parentId is not null and is not found', async () => {
            const [error] = await TO(categoriesService.createCategory(INEXISTENT_CATEGORY_ID_MOCK, LABEL_MOCK));

            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should create a category with passed fields', async () => {
            const [error, result] = await TO(categoriesService.createCategory(PARENT_CATEGORY_MOCK, LABEL_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({ id: ID_MOCK, label: LABEL_MOCK, parentId: PARENT_CATEGORY_MOCK });
        });
    });

    describe('and the method updateCategory', () => {
        const INEXISTENT_ID_MOCK = 'uadadasdas';
        const ID_MOCK = 'uadad';
        const ID_2_MOCK = 'uadad2';
        const NULL_PARENT_ID_MOCK = null;
        const LABEL_MOCK = 'Label for category';
        const LABEL_2_MOCK = '';

        const NULL_LABEL = '';

        afterEach(async () => {
            await categoriesTestingUtils.clear();
        });

        it('should throw error if not found', async () => {
            const [error] = await TO(
                categoriesService.updateCategory(INEXISTENT_ID_MOCK, NULL_PARENT_ID_MOCK, NULL_LABEL)
            );
            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should throw error if label is duplicated', async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK });
            await categoriesTestingUtils.create({ label: LABEL_MOCK });

            const [error] = await TO(categoriesService.updateCategory(ID_MOCK, NULL_PARENT_ID_MOCK, LABEL_MOCK));
            expect(error).to.be.instanceOf(ConflictError);
        });

        it('should throw error when set circular parent category', async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK, parentId: null });
            await categoriesTestingUtils.create({ id: ID_2_MOCK, parentId: ID_MOCK });

            const [error] = await TO(categoriesService.updateCategory(ID_MOCK, ID_2_MOCK, NULL_LABEL));
            expect(error).to.be.instanceOf(ConflictError);
        });

        it('should throw error when parentId is now owned by a category', async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK, parentId: null });

            const [error] = await TO(categoriesService.updateCategory(ID_MOCK, ID_2_MOCK, NULL_LABEL));
            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should throw error when category is assigned to itsefl', async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK, parentId: null });

            const [error] = await TO(categoriesService.updateCategory(ID_MOCK, ID_MOCK, NULL_LABEL));
            expect(error).to.be.instanceOf(ConflictError);
        });

        it('should update the fields', async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK });
            await categoriesTestingUtils.create({ id: ID_2_MOCK });

            const [error, result] = await TO(categoriesService.updateCategory(ID_MOCK, ID_2_MOCK, LABEL_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({ id: ID_MOCK, parentId: ID_2_MOCK, label: LABEL_MOCK });
        });

        it('should update the fields if label is empty', async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK });
            await categoriesTestingUtils.create({ id: ID_2_MOCK });

            const [error, result] = await TO(categoriesService.updateCategory(ID_MOCK, ID_2_MOCK, LABEL_2_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({ id: ID_MOCK, parentId: ID_2_MOCK, label: LABEL_2_MOCK });
        });

        it('should update the parentId if label is the same', async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK, label: LABEL_2_MOCK });
            await categoriesTestingUtils.create({ id: ID_2_MOCK });

            const [error, result] = await TO(categoriesService.updateCategory(ID_MOCK, ID_2_MOCK, LABEL_2_MOCK));

            expect(error).to.be.null;
            expect(result).to.be.deep.equal({ id: ID_MOCK, parentId: ID_2_MOCK, label: LABEL_2_MOCK });
        });
    });

    describe('and the method deleteCategory', () => {
        const INEXISTENT_ID_MOCK = 'uadadasdas';
        const ID_MOCK = 'uadad';

        beforeEach(async () => {
            await categoriesTestingUtils.create({ id: ID_MOCK });
        });

        afterEach(async () => {
            await categoriesTestingUtils.clear();
        });

        it('should throw error if not found', async () => {
            const [error] = await TO(categoriesService.deleteCategory(INEXISTENT_ID_MOCK));
            expect(error).to.be.instanceOf(NotFoundError);
        });

        it('should remove row', async () => {
            const [error] = await TO(categoriesService.deleteCategory(ID_MOCK));

            expect(error).to.be.null;
            const c = await Categories.where('id', ID_MOCK)
                .fetch()
                .catch(e => null);
            expect(c).to.be.null;
        });
    });
});
