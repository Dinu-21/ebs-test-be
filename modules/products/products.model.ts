import db from '../../core/database';

const Products = db.createModel('Products', {
    tableName: 'products',
});

export default Products;
