import { NODE_ENV } from './static';
import * as dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
    NODE_ENV: process.env.NODE_ENV || NODE_ENV.DEVELOPMENT,
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    get DB_URI() {
        if (CONFIG.NODE_ENV === NODE_ENV.MOCHA) return process.env.DB_MOCHA_URI;

        return process.env.DB_URI;
    },
};

export default CONFIG;
