import knex from 'knex';
import bookshelf from 'bookshelf';
import knexConfig from '../knexfile';
import bsEloquent from 'bookshelf-eloquent';

const knexConnection = knex(knexConfig) as any;

class DB {
    bs;
    constructor() {
        this.bs = null;
        this.connect()
    }
    connect() {
        try {
            this.bs = bookshelf(knexConnection);
            this.bs.plugin(bsEloquent);
            console.log('Connection to database has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    createModel(...params: any) {
        return this.bs.model(...params);
    }
}
export default new DB();
