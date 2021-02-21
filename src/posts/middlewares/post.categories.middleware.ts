import { NextFunction, Request, Response } from "express";
import { CategoryRepository } from "../../categories/repositories/category.repository";
import { ICategoryDTO } from "../../categories/utilities/category.interface";
import { HttpBadRequestError } from "../../common/utilities/http.errors";


export class PostCategoriesMiddleware {

  private readonly categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public validateCategoriesExist = () => {
    return async (request: Request, response: Response, next: NextFunction) => {

      const categories: ICategoryDTO[] = request.body.categories;

      if (categories === undefined || (categories && categories.length === 0)) {
        return next();
      }

      const filteredCategories = [...new Set(categories)];
      const categoryIds = filteredCategories.map((category: ICategoryDTO) => category.id);
      const categoriesCount = await this.categoryRepository.countCategoriesById(categoryIds);

      if (categoriesCount !== filteredCategories.length) {
        const badRequestError = new HttpBadRequestError("categories do not exist");
        return response.status(badRequestError.code).send(badRequestError.getErrorResponse());
      }

      request.body.categories = filteredCategories;
      next();
    }
  }
}