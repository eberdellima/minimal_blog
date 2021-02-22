import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ValidationError } from "../../common/utilities/validation.errors";


export class CategoryValidator {

  private readonly validator: Joi.Root;

  constructor() {
    this.validator = Joi;
  }

  public validateInsertInput = () => {
    return (request: Request, response: Response, next: NextFunction) => {

      const schema: Joi.ObjectSchema = this.validator.object({
        name: this.validator.string().min(2).required()
      });

      const { error } = schema.validate(request.body, { abortEarly: false });

      if (error) {
        const validationError = new ValidationError();
        validationError.details = error.details;
        return response.status(validationError.code).send(validationError.getErrorResponse());
      }

      next();
    }
  }

  public validateUpdateInput = () => {
    return (request: Request, response: Response, next: NextFunction) => {

      const schema: Joi.ObjectSchema = this.validator.object({
        id: this.validator.number().positive().required(),
        name: this.validator.string().min(2).required()
      });

      const updateInput = {
        id: +request.params.categoryId,
        name: request.body.name,
      }

      const { error } = schema.validate(updateInput, { abortEarly: false });

      if (error) {
        const validationError = new ValidationError();
        validationError.details = error.details;
        return response.status(validationError.code).send(validationError.getErrorResponse());
      }

      next();
    }
  }
}