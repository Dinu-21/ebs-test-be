import Joi from 'joi';

export const PatchProductBody = Joi.object({
    label: Joi.string().required(),
    categoryId: Joi.string().allow(null).required(),
});
