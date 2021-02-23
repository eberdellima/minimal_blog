import { Request, Response } from "express";
import { ICategoryDTO } from "../../categories/utilities/category.interface";
import { BaseController } from "../../common/controllers/base.controller";
import { HttpBadRequestError } from "../../common/utilities/http.errors";
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

      const postId: number = +request.params.postId;
      const categories: ICategoryDTO[] = request.body.categories;

      if (isNaN(postId)) {
        const badRequestError = new HttpBadRequestError();
        return response.status(badRequestError.code).send(badRequestError.getErrorResponse());
      }

      const updatedPost = await this.postManager.modifyPostCategories(postId, categories);
      response.status(200).send(updatedPost);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }
      
      response.status(this.internalServerError.code).send(this.internalServerError.getErrorResponse());
    }
  }
}