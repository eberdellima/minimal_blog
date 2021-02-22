import { Router } from "express";
import { Connection } from "typeorm";
import { PaginationValidator } from "../common/middlewares/paginator.validator";
import { CategoryController } from './controllers/category.controller';
import { CategoryValidator } from "./middlewares/category.validator";
import { CategoryRepository } from './repositories/category.repository';
import { CategoryManager } from './services/category.manager.service';


export function configureRouter(router: Router, connection: Connection) {

  const paginationValidator = new PaginationValidator();
  const categoryValidator = new CategoryValidator();

  const categoryRepository = connection.getCustomRepository(CategoryRepository);
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

  router.get('/:categoryId', [
    categoryController.getCategory,
  ]);

  router.patch('/:categoryId', [
    categoryValidator.validateUpdateInput(),
    categoryController.modifyCategoryName,
  ]);

  router.delete('/:categoryId', [
    categoryController.deleteCategory,
  ]);
}