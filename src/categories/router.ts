import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { PaginationValidator } from "../common/middlewares/paginator.validator";
import { CategoryController } from './controllers/category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryManager } from './services/category.manager.service';


export function configureRouter(router: Router) {

  const paginationValidator = new PaginationValidator();

  const categoryRepository = getCustomRepository(CategoryRepository);
  const categoryManager = new CategoryManager(categoryRepository);
  const categoryController = new CategoryController(categoryManager);

  router.get('/', [
    paginationValidator.validate(),
    categoryController.listCategories,
  ]);

  router.post('/', [
    categoryController.addCategory,
  ]);
}