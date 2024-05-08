import { body, param } from "express-validator";

export const uuidPathVariableValidator = (idName) => {
    return [
      param(idName).notEmpty().isUUID().withMessage(`Invalid ${idName}`),
    ];
  };


export const uuidRequestBodyValidator = (idName) => {
    return [body(idName).notEmpty().isUUID().withMessage(`Invalid ${idName}`)];
  };
  