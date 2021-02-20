import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { PaginationValidator } from "../common/middlewares/paginator.validator";
import { CategoryController } from './controllers/category.controller';
import { CategoryValidator } from "./middlewares/category.validator";
import { CategoryRepository } from './repositories/category.repository';
import { CategoryManager } from './services/category.manager.service';


export function configureRouter(router: Router) {

  const paginationValidator = new PaginationValidator();
  const categoryValidator = new CategoryValidator();

  const categoryRepository = getCustomRepository(CategoryRepository);
  const categoryManager = new CategoryManager(categoryRepository);
  const categoryController = new CategoryController(categoryManager);

  router.get('/', [
    paginationValidator.validate(),
    categoryController.listCategories,
  ]);

  router.post('/', [
    categoryValidator.validateInsertInput(),
    categoryController.addCategory,
  ]);

  router.patch('/:categoryId', [
    categoryValidator.validateUpdateInput(),
    categoryController.modifyCategoryName,
  ]);

  router.delete('/:categoryId', [
    categoryController.deleteCategory,
  ]);
}