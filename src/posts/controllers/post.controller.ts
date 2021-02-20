import { Request, Response } from "express";
import { Pagination } from "../../common/utilities/pagination";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { PostManager } from "../services/post.manager";


export class PostController {

  private readonly postManager: PostManager;

  constructor(postManager: PostManager) {
    this.postManager = postManager;
  }

  public listPosts = async (request: Request, response: Response) => {

    try {

      const pagination: Pagination = new Pagination(response.locals.pagination);
      const paginationDTO: IPaginationDTO = {
        size: pagination.getSize(),
        offset: pagination.getOffset(),
        orderBy: pagination.getOrderBy(),
        orderDirection: pagination.getOrderDirection()
      };

      const [posts, total] = await this.postManager.getPostList(paginationDTO);
      response.status(200).send({posts, total});
      
    } catch(err) {
      response.status(500).send({message: "Internal server error"});
    }
  }
}