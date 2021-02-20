import { Request, Response } from "express";
import { ICategoryDTO } from "../../categories/utilities/category.interface";
import { PostManager } from "../services/post.manager.service";
import { PostNotFoundError } from "../utilities/post.errors";


export class PostCategoriesController {

  private readonly postManager: PostManager;

  constructor(postManager: PostManager) {
    this.postManager = postManager;
  }

  public updatePostCategories = async (request: Request, response: Response) => {

    try {

      const postId: number = +request.params.postId;
      const categories: ICategoryDTO[] = request.body.categories;

      if (isNaN(postId)) {
        return response.status(400).send("Invalid request");
      }

      const updatedPost = await this.postManager.modifyPostCategories(postId, categories);
      response.status(200).send(updatedPost);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(404).send({
          message: err.message,
          type: err.type
        });
      }
      
      response.status(500).send({message: "Internal server error"});
    }
  }
}