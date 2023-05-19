import CONFIG from '../config/config';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
    info: {
        title: 'API',
        version: '1.0.0',
        description: 'EBS test api',
    },
    host: `localhost:${CONFIG.PORT}`,
    openapi: '3.0.0'
};
const options = {
    swaggerDefinition,
    apis: ['./modules/**/*.route.ts'],
};

export default swaggerJsdoc(options);
