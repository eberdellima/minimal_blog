import { NextFunction, Request, Response } from "express";
import Joi from "joi";


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
        return response.status(400).send({
           message: "Valiation error" ,
           details: error.details
        });
      }

      next();
    }
  }
}