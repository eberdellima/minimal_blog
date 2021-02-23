import { Request, Response } from "express";
import { ICategoryDTO } from "../../categories/utilities/category.interface";
import { BaseController } from "../../common/controllers/base.controller";
import { PostManager } from "../services/post.manager.service";
import { PostNotFoundError } from "../utilities/post.errors";


export class PostCategoriesController extends BaseController {

  private readonly postManager: PostManager;

  constructor(postManager: PostManager) {
    super();
    this.postManager = postManager;
  }

  public updatePostCategories = async (request: Request, response: Response) => {

    try {

      const categories: ICategoryDTO[] = request.body.categories;

      const updatedPost = await this.postManager.modifyPostCategories(+request.params.postId, categories);
      response.status(200).send(updatedPost);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }
      
      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }
}