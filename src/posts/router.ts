import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { PaginationValidator } from "../common/middlewares/paginator.validator";
import { PostController } from "./controllers/post.controller";
import { PostManager } from "./services/post.manager.service";
import { PostRepository } from './repositories/post.repository';
import { PostValidator } from "./middlewares/post.validator";
import { PostCategoriesMiddleware } from "./middlewares/post.categories.middleware";
import { CategoryRepository } from "../categories/repositories/category.repository";
import { NanoIdSlugifier } from "../common/utilities/slugifier";


export function configureRouter(router: Router) {

  const paginationValidator = new PaginationValidator();
  const postValidator = new PostValidator();

  const nanoIdSlugifier = new NanoIdSlugifier();
  const postRepository = getCustomRepository(PostRepository);
  const postManager = new PostManager(postRepository, nanoIdSlugifier);
  const postController = new PostController(postManager);

  const categoryRepository = getCustomRepository(CategoryRepository);
  const postCategoriesMiddleware = new PostCategoriesMiddleware(categoryRepository);

  router.get('/', [
    paginationValidator.validate(),
    postController.listPosts,
  ]);

  router.post('/', [
    postValidator.validateInsertInput(),
    postCategoriesMiddleware.validateCategoriesExist(),
    postController.addPost,
  ]);

  router.get('/:postId', [
    postController.getPost,
  ]);

  router.patch('/:postId', [
    postValidator.validateUpdateInput(),
    postController.modifyPost,
  ]);
  
}