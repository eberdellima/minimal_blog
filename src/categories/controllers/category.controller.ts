import { Request, Response } from "express";
import { Pagination } from "../../common/utilities/pagination";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { CategoryManager } from "../services/category.manager.service";


export class CategoryController {

  private readonly categoryManager: CategoryManager;

  constructor(categoryManager: CategoryManager) {
    this.categoryManager = categoryManager;
  }

  public async listCategories(request: Request, response: Response) {
    
    try {

      const pagination: Pagination = new Pagination(response.locals.paginationData);
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
}