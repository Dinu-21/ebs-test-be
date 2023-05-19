import path from 'path';

import CONFIG from '../config/config';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import swaggerSpec from './swaggerSpec';

import categoriesRoutes from '../modules/categories/categories.route';
import productsRoutes from '../modules/products/products.route';

async function run() {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.use('/api/v1/categories', categoriesRoutes);
    app.use('/api/v1/products', productsRoutes);

    app.use('/', express.static(path.join(__dirname, '../build')));

    app.listen(CONFIG.PORT, () => console.log('Server has been started on http://localhost:' + CONFIG.PORT));
}

export default run();
