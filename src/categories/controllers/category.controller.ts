import { Request, Response } from "express";
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
      response.status(500).send({message: "Internal server error"});
    }
  }

  public addCategory = async (request: Request, response: Response) => {
     
    try {

      const categoryDto: ICategoryDTO = {
        name: request.body.name,
      }

      const { id, name } = await this.categoryManager.addCategory(categoryDto);
      response.status(201).send({ id, name });

    } catch(err) {
      response.status(500).send({message: "Internal server error"});
    }
  }

  public modifyCategoryName = async (request: Request, response: Response) => {

    try {

      const categoryDto: ICategoryDTO = {
        id: +request.params.categoryId,
        name: request.body.name,
      }

      const { id, name } = await this.categoryManager.updateCategoryName(categoryDto);
      response.status(201).send({ id, name });

    } catch(err) {

      if (err instanceof CategoryNotFoundError) {
        return response.status(404).send({
          message: err.message,
          type: err.type
        });
      }

      response.status(500).send({message: "Internal server error"});
    }
  }

  public deleteCategory = async (request: Request, response: Response) => {

    try {

      const categoryId: number = +request.params.categoryId;

      if (isNaN(categoryId)) {
        return response.status(400).send("Invalid request");
      }

      await this.categoryManager.deleteCategoryById(categoryId);
      response.status(204).send();

    } catch(err) {

      if (err instanceof CategoryNotFoundError) {
        return response.status(404).send({
          message: err.message,
          type: err.type
        });
      }
      
      response.status(500).send({message: "Internal server error"});
    }
  }
}