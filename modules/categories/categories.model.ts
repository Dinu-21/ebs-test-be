import db from '../../core/database';

const Categories = db.createModel('Categories', {
    tableName: 'categories',
});

export default Categories;
