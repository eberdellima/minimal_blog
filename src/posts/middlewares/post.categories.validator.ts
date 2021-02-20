import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export class PostCategoriesValidator {

  private readonly validator: Joi.Root;

  constructor() {
    this.validator = Joi;
  }

  public validatePostCategoriesInput = () => {
    return (request: Request, response: Response, next: NextFunction) => {

      const schema: Joi.ObjectSchema = this.validator.object({
        categories: this.validator.array().items(this.validator.object({
          id: this.validator.number().integer().required(),
          name: this.validator.string().min(3).required(),
        })).required(),
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