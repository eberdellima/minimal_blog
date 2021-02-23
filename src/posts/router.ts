import { Router } from "express";
import { Connection } from "typeorm";
import { PaginationValidator } from "../common/middlewares/paginator.validator";
import { PostController } from "./controllers/post.controller";
import { PostManager } from "./services/post.manager.service";
import { PostRepository } from './repositories/post.repository';
import { PostValidator } from "./middlewares/post.validator";
import { PostCategoriesMiddleware } from "./middlewares/post.categories.middleware";
import { PostCategoriesValidator } from "./middlewares/post.categories.validator";
import { CategoryRepository } from "../categories/repositories/category.repository";
import { NanoIdSlugifier } from "../common/utilities/slugifier";
import { PostCategoriesController } from "./controllers/post.categories.controller";


export function configureRouter(router: Router, connection: Connection) {

  const paginationValidator = new PaginationValidator();
  const postValidator = new PostValidator();
  const postCategoriesValidator = new PostCategoriesValidator();
  
  const postRepository = connection.getCustomRepository(PostRepository);
  const categoryRepository = connection.getCustomRepository(CategoryRepository);

  const postCategoriesMiddleware = new PostCategoriesMiddleware(categoryRepository);
  
  const nanoIdSlugifier = new NanoIdSlugifier();

  const postManager = new PostManager(postRepository, nanoIdSlugifier);

  const postController = new PostController(postManager);
  const postCategoriesController = new PostCategoriesController(postManager);

  router.get('/', [
    paginationValidator.validate(),
    postController.listPosts,
  ]);

  router.post('/', [
    postValidator.validateInsertInput(),
    postCategoriesMiddleware.validateCategoriesExist(),
    postController.addPost,
  ]);

  router.get('/:postId(\\d+)', [
    postController.getPost,
  ]);

  router.patch('/:postId(\\d+)', [
    postValidator.validateUpdateInput(),
    postController.modifyPost,
  ]);
  
  router.delete('/:postId(\\d+)', [
    postController.deletePost,
  ]);

  router.patch('/:postId(\\d+)/categories', [
    postCategoriesValidator.validatePostCategoriesInput(),
    postCategoriesMiddleware.validateCategoriesExist(),
    postCategoriesController.updatePostCategories,
  ]);
}