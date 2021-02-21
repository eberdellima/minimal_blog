import { Request, Response } from "express";
import { HttpBadRequestError, HttpInternalServerError } from "../../common/utilities/http.errors";
import { Pagination } from "../../common/utilities/pagination";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { CategoryManager } from "../services/category.manager.service";
import { CategoryNotFoundError } from "../utilities/category.errors";
import { ICategoryDTO } from "../utilities/category.interface";


export class CategoryController {

  private readonly categoryManager: CategoryManager;

  constructor(categoryManager: CategoryManager) {
    this.categoryManager = categoryManager;
  }

  public listCategories = async (request: Request, response: Response) => {
    
    try {

      const pagination: Pagination = new Pagination(response.locals.pagination);
      const paginationDTO: IPaginationDTO = {
        size: pagination.getSize(),
        offset: pagination.getOffset(),
        orderBy: pagination.getOrderBy(),
        orderDirection: pagination.getOrderDirection()
      };

      const [categories, total] = await this.categoryManager.getCategoryList(paginationDTO);
      response.status(200).send({categories, total});
      
    } catch(err) {
      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }

  public addCategory = async (request: Request, response: Response) => {
     
    try {

      const categoryDto: ICategoryDTO = {
        name: request.body.name,
      }

      const category = await this.categoryManager.addCategory(categoryDto);
      response.status(201).send(category);

    } catch(err) {
      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }

  public getCategory = async (request: Request, response: Response) => {

    try {

      const categoryId = +request.params.categoryId;

      if (isNaN(categoryId)) {
        const badRequestError = new HttpBadRequestError();
        return response.status(badRequestError.code).send(badRequestError.getErrorResponse());
      }

      const category = await this.categoryManager.getCategoryById(categoryId);
      response.status(200).send(category);

    } catch(err) {

      if (err instanceof CategoryNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }

  public modifyCategoryName = async (request: Request, response: Response) => {

    try {

      const categoryDto: ICategoryDTO = {
        id: +request.params.categoryId,
        name: request.body.name,
      }

      const category = await this.categoryManager.updateCategoryName(categoryDto);
      response.status(201).send(category);

    } catch(err) {

      if (err instanceof CategoryNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }

  public deleteCategory = async (request: Request, response: Response) => {

    try {

      const categoryId: number = +request.params.categoryId;

      if (isNaN(categoryId)) {
        const badRequestError = new HttpBadRequestError();
        return response.status(badRequestError.code).send(badRequestError.getErrorResponse());
      }

      await this.categoryManager.deleteCategoryById(categoryId);
      response.status(204).send();

    } catch(err) {

      if (err instanceof CategoryNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }
      
      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }
}