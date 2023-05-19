import Joi from 'joi';
import { InputValidationError } from '../config/errors';
import { Respond } from '../utils/http';

function validateBody(schema: Joi.AnySchema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        const valid = error == null;

        if (!valid) {
            const { details } = error;
            const message = details.map(i => i.message).join('\n');
            const httpError = new InputValidationError(message);
            return Respond(res, httpError, null);
        }

        next();
    };
}

export default validateBody;
