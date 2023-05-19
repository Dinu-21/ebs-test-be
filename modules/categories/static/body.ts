import Joi from 'joi';

export const PatchCategoryBody = Joi.object({
    label: Joi.string().min(1).max(128).required(),
    parentId: Joi.string().allow(null).required(),
});
