import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { PaginationValidator } from "../common/middlewares/paginator.validator";
import { PostController } from "./controllers/post.controller";
import { PostManager } from "./services/post.manager";
import { PostRepository } from './repositories/post.repository';


export function configureRouter(router: Router) {

  const paginationValidator = new PaginationValidator();

  const postRepository = getCustomRepository(PostRepository);
  const postManager = new PostManager(postRepository);
  const postController = new PostController(postManager);

  router.get('/', [
    paginationValidator.validate(),
    postController.listPosts,
  ]);
  
}