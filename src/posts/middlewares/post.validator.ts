import { NextFunction, Request, Response } from "express";
import Joi from "joi";


export class PostValidator {

  private readonly validator: Joi.Root;

  constructor() {
    this.validator = Joi;
  }

  public validateInsertInput = () => {
    return (request: Request, response: Response, next: NextFunction) => {

      const schema: Joi.ObjectSchema = this.validator.object({
        title: this.validator.string().min(5).max(121).required(),
        description: this.validator.string().not("").required(),
        categories: this.validator.array().items(this.validator.object({
          id: this.validator.number().integer().required(),
          name: this.validator.string().min(3).required(),
        })).optional(),
        slug: this.validator.string().min(5).max(121).optional(),
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

  public validateUpdateInput = () => {
    return (request: Request, response: Response, next: NextFunction) => {

      const schema: Joi.ObjectSchema = this.validator.object({
        id: this.validator.number().integer().positive().required(),
        title: this.validator.string().min(5).max(121).required(),
        description: this.validator.string().not("").required(),
      });

      const updateInput = {
        id: +request.params.postId,
        name: request.body.title,
        description: request.body.description,
      }

      const { error } = schema.validate(updateInput, { abortEarly: false });

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