import { Router } from 'express';
import { TO } from '../../utils/promise';
import { Respond } from '../../utils/http';
import validateBody from '../../middleware/validateBody';
import { PatchProductBody } from './static/body';
import productsService from './products.service';
const router = Router();

/**
 * @swagger
 * /api/v1/products/{productId}:
 *   get:
 *     tags:
 *      - Products
 *     description: Get product by id
 *     parameters:
 *       - in: path
 *         name: productId
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
 *                     description: The category name
 *                    categoryId:
 *                     type: string | null
 *                     description: The category's parent id
 *                  example:
 *                    id: 'asdf'
 *                    label: 'Technical'
 *                    categoryId: null
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
 *                      message: 'Product with id (id) not found.'
 *                      stack: 'Error: Product with id (erfd) not found'
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const [error, result] = await TO(productsService.getProduct(id));

    return Respond(res, error, result);
});


/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     tags:
 *      - Products
 *     description: Get all products
 *     responses:
 *       200:
 *         description: Successful Response
 *         content:
 *             application/json:
 *               schema:
 *                  type: array
 *                  items: 
 *                     type: object
 *                     properties:
 *                       id:
 *                        type: string
 *                        description: The product id
 *                       label:
 *                        type: string
 *                        description: The product name
 *                       categoryId:
 *                        type: string | null
 *                        description: The product caterogy id
 *                  example:
 *                   [ {id: 'asdf', label: 'Technical', categoryId: null} ]
 */
router.get('/', async (req, res) => {
    const [error, result] = await TO(productsService.getAllProducts());

    return Respond(res, error, result);
});


/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     tags:
 *      - Products
 *     description: Create new product and returns its id
 *     requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                 schema:
 *                    type: object
 *                    properties:
 *                       label:
 *                          type: string
 *                          description: min length 1 max 256
 *                          required: true
 *                       categoryId:
 *                          type: string | null
 *                          required: true
 *                    example:
 *                      label: 'Commercial'
 *                      categoryId: null
 *     responses:
 *       200:
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
 *                   categoryId:
 *                      type: string | null
 *                example:
 *                  id: 'FHAKSAF2'
 *                  label: 'Commercial'
 *                  categoryId: null
 */
router.post('/', validateBody(PatchProductBody), async (req, res) => {
    const { categoryId, label } = req.body;

    const [error, result] = await TO(productsService.createProduct(categoryId, label));

    return Respond(res, error, result);
});

/**
 * @swagger
 * /api/v1/products/{productId}:
 *   patch:
 *     tags:
 *      - Products
 *     description: Update product details
 *     parameters:
 *       - in: path
 *         name: productId
 *         type: string
 *         required: true
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   label:
 *                      type: string
 *                      required: true
 *                   categoryId:
 *                      type: string | null
 *                      required: true
 *                example:
 *                  label: 'aProduct'
 *                  categoryId: null
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
 *                     description: The product id
 *                    label:
 *                     type: string
 *                     description: The product name
 *                    categoryId:
 *                     type: string | null
 *                     description: The product caterogy id
 *               example:
 *                  {id: 'asdf', label: 'Technical', categoryId: null}
 *       404:
 *          description: Not found error
 */
router.patch('/:id', validateBody(PatchProductBody), async (req, res) => {
    const { id } = req.params;
    const { categoryId, label } = req.body;

    const [error, result] = await TO(productsService.updateProduct(id, categoryId, label));

    return Respond(res, error, result);
});

/**
 * @swagger
 * /api/v1/products/{productId}:
 *   delete:
 *     tags:
 *      - Products
 *     description: Remove a product
 *     parameters:
 *      - in: path
 *        name: productId
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

    const [error, result] = await TO(productsService.deleteProduct(id));

    return Respond(res, error, result);
});



export default router;
