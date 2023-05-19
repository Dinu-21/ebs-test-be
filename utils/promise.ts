import { CustomError } from '../config/errors';

export const TO = async function <T=any>(promise: Promise<T>, defaultValue?: any): Promise<[CustomError, T]> {
    let error: CustomError = null;
    let result: T = defaultValue || null;
    try {
        result = await promise;
        return [error, result];
    } catch (e) {
        return [e, result];
    }
};
