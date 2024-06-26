import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().lowercase().trim(),
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({ "any.required": "Missing required field: email" }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({ "any.required": "Missing required field: password" }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .trim()
    .messages({ "any.required": "Missing required field: email" }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({ "any.required": "Missing required field: password" }),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});
