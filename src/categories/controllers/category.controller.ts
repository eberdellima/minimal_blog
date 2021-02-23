import { Request, Response } from "express";
import { BaseController } from "../../common/controllers/base.controller";
import { HttpBadRequestError } from "../../common/utilities/http.errors";
import { Pagination } from "../../common/utilities/pagination";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { CategoryManager } from "../services/category.manager.service";
import { CategoryAlreadyExistsError, CategoryNotFoundError } from "../utilities/category.errors";
import { ICategoryDTO } from "../utilities/category.interface";


export class CategoryController extends BaseController {

  private readonly categoryManager: CategoryManager;

  constructor(categoryManager: CategoryManager) {
    super();
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
      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
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

      if (err instanceof CategoryAlreadyExistsError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
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

      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }

  public modifyCategoryName = async (request: Request, response: Response) => {

    try {

      const categoryDto: ICategoryDTO = {
        id: +request.params.categoryId,
        name: request.body.name,
      }

      const category = await this.categoryManager.updateCategoryName(categoryDto);
      response.status(200).send(category);

    } catch(err) {

      if (err instanceof CategoryNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
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
      
      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }
}