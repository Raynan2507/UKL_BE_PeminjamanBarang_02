import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Skema validasi untuk membuat peminjaman
const createSchema = Joi.object({
    userId: Joi.number().integer().required(),
    itemId: Joi.number().integer().required(),
    borrowDate: Joi.date().required(),
    returnDate: Joi.date().required(), 
});

// Middleware untuk validasi saat membuat peminjaman
const createValidation = (req: Request, res: Response, next: NextFunction): any => {
    const validate = createSchema.validate(req.body);
    if (validate.error) {
        return res.status(400).json(validate.error.details.map(item => item.message).join(","));
    }
    next();
};

const returnSchema = Joi.object({
    borrowId: Joi.number().min(1).required(),
    returnDate: Joi.date().required(),
});

const returnValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = returnSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
};

// update a rule/schema for adding new medicine
const usageReport = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    group_by: Joi.string().valid("category", "location").required(),
});

const usageValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = usageReport.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
};

export { createValidation, returnValidation, usageValidation };