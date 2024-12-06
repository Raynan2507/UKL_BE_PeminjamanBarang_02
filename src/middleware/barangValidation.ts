import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createShecma = Joi.object({
    name : Joi.string().required(),
    category : Joi.string().required(),
    location : Joi.string().required(),
    quantity : Joi.number().min(1).required()
})

const createValidation = (req: Request, res: Response, next: NextFunction): any => {
    const validate = createShecma.validate(req.body);
    if (validate.error) {
        return res.status(400).json(validate.error.details.map(item => item.message).join(","));
    }
    next();
}

const updateShecma = Joi.object({
    name : Joi.string().optional(),
    category : Joi.string().optional(),
    location : Joi.string().optional(),
    quantity : Joi.number().min(1).optional()
})

const updateValidation = (req: Request, res: Response, next: NextFunction): any => {
    const validate = updateShecma.validate(req.body);
    if (validate.error) {
        return res.status(400).json(validate.error.details.map(item => item.message).join(","));
    }
    next();
}

export { createValidation, updateValidation };