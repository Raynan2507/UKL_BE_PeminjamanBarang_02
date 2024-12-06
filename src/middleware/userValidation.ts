import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("Admin", "User").required(),
});

const createUserValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = createUserSchema.validate(req.body);
  if (validate.error) {
    return res.status(401).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  role: Joi.string().valid("Admin", "User").optional(),
});

const updateUserValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = updateUserSchema.validate(req.body);
  if (validate.error) {
    return res.status(402).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const authScheme = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().optional(),
});

const authValidation = (req: Request, res: Response, next: NextFunction): any => {
  const validate = authScheme.validate(req.body);
  if (validate.error) {
    return res.status(403).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createUserValidation, updateUserValidation, authValidation };