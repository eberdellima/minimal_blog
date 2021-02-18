import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { PaginationValidator } from "../common/middlewares/paginator.validator";
import { CategoryController } from './controllers/category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryManager } from './services/category.manager.service';


export function configureRouter(router: Router) {

  const paginationValidator = new PaginationValidator();

  const categoryRepository: CategoryRepository = getCustomRepository(CategoryRepository);
  const categoryManager: CategoryManager = new CategoryManager(categoryRepository);
  const categoryController: CategoryController = new CategoryController(categoryManager);

  router.get('/', [
    paginationValidator.validate(),
    categoryController.listCategories,
  ]);
}