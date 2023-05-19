import CONFIG from './config/config';


export default {
    // log:'debug',
    // debug:true,
    client: 'pg',
    connection: CONFIG.DB_URI,
    migrations: {
        tableName: 'knex_migrations',
    },
};
