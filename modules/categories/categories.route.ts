import { Router } from 'express';
import { TO } from '../../utils/promise';
import { Respond } from '../../utils/http';
import categoriesService from './categories.service';
import { PatchCategoryBody } from './static/body';
import validateBody from '../../middleware/validateBody';
const router = Router();

/**
 * @swagger
 * /api/v1/categories/{categoryId}:
 *   get:
 *     tags:
 *      - Categories
 *     description: Get category by id
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *             application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                    id:
 *                     type: string
 *                     description: The category id
 *                    label:
 *                     type: string
 *                     description: The category label. Max length is 128
 *                    parentId:
 *                     type: string | null
 *                     description: The category's parent id
 *                  example:
 *                    id: 'asdf'
 *                    label: 'Technical'
 *                    parentId: null
 *       404:
 *         description: Not found error
 *         content:
 *             application/json:
 *               schema:
 *                    type: object
 *                    properties:
 *                        message:
 *                            type: string
 *                        stack:
 *                            type: string
 *                    example:
 *                      message: 'Category with id (id) not found.'
 *                      stack: 'Error: Category with id (erfd) not found'
 */
router.get('/:categoryId', async (req, res) => {
    const { categoryId } = req.params;

    const [error, result] = await TO(categoriesService.getCategory(categoryId));

    return Respond(res, error, result);
});

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     tags:
 *      - Categories
 *     description: Get all categories as a tree. Returns empty array if there is no categories
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *             application/json:
 *                 schema:
 *                      type: object
 *                      properties:
 *                        id:
 *                         type: string
 *                         description: The category id
 *                        label:
 *                         type: string
 *                         description: The category name
 *                        parentId:
 *                         type: string | null
 *                         description: The category's parent id
 *                        children:
 *                          type: array
 *                          description: Category model's list
 *                        productsCount:
 *                          type: number
 *                          description: Products count with this category plus products from parent category if exists
 *                      example:
 *                        id: 'HDKbasdj76dak'
 *                        label: 'Technical'
 *                        parentId: null
 *                        children: []
 *                        productsCount: 20
 */
router.get('/', async (req, res) => {
    const [error, result] = await TO(categoriesService.getAllCategories());

    return Respond(res, error, result);
});

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     tags:
 *      - Categories
 *     description: Create a new category and returns its
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                     label:
 *                        type: string
 *                        description: min length 1 max 128
 *                        required: true
 *                     parentId:
 *                        type: string | null
 *                        required: true
 *                  example:
 *                    label: 'Commercial'
 *                    parentId: null
 *     responses:
 *       201:
 *         description: Successful Response
 *         content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   id:
 *                      type:string
 *                   label:
 *                      type: string
 *                   parentId:
 *                      type: string | null
 *                example:
 *                  id: 'FHAKSAF2'
 *                  label: 'Commercial'
 *                  parentId: null
 *       404:
 *         description: Not found error
 *       409:
 *         description: Conflict error
 */
router.post('/', validateBody(PatchCategoryBody), async (req, res) => {
    const { label, parentId } = req.body;

    const [error, result] = await TO(categoriesService.createCategory(parentId, label));

    return Respond(res, error, result, 201);
});

/**
 * @swagger
 * /api/v1/categories/{categoryId}:
 *   patch:
 *     tags:
 *      - Categories
 *     description: Update a category
 *     parameters:
 *      - in: path
 *        name: categoryId
 *        type: string
 *        required: true
 *     requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                schema:
 *                   type: object
 *                   properties:
 *                      label:
 *                         type: string
 *                         required: true
 *                         description: Min length 1 max 128
 *                      parentId:
 *                         type: string | null
 *                         required: true
 *                   example:
 *                     label: 'Commercial'
 *                     parentId: null
 *     responses:
 *          200:
 *            description: Successful Response
 *            content:
 *               application/json:
 *                  schema:
 *                     type: object
 *                     properties:
 *                          id:
 *                           type: string
 *                          label:
 *                           type: string
 *                          parentId:
 *                           type: string | null
 *                     example:
 *                       id: 'FHAKSAF2'
 *                       label: 'Commercial'
 *                       parentId: null
 *          422:
 *             description: Input validation error
 */
router.patch('/:id', validateBody(PatchCategoryBody), async (req, res) => {
    const { id } = req.params;
    const { label, parentId } = req.body;

    const [error, result] = await TO(categoriesService.updateCategory(id, parentId, label));

    return Respond(res, error, result);
});

/**
 * @swagger
 * /api/v1/categories/{categorId}:
 *   delete:
 *     tags:
 *      - Categories
 *     description: Remove a category
 *     parameters:
 *      - in: path
 *        name: categoryId
 *        type: string
 *        required: true
 *     responses:
 *       200:
 *         description: Successful Response
 *       404:
 *         description: Not found error
 */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const [error, result] = await TO(categoriesService.deleteCategory(id));

    return Respond(res, error, result);
});

export default router;
