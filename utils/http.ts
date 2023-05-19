import { CustomError } from '../config/errors';
import { Response } from 'express';

export async function Respond(res: Response, error: CustomError, result: any, customStatusCode?: number) {
    if (error)
        return res.status(error?.status || 500).send({
            message: error.message,
            stack: error.stack,
        });

    return res.status(customStatusCode || 200).send(result);
}
