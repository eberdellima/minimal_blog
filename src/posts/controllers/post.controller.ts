import { Request, Response } from "express";
import { Pagination } from "../../common/utilities/pagination";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { PostManager } from "../services/post.manager.service";
import { PostNotFoundError } from "../utilities/post.errors";
import { IPostDTO } from "../utilities/post.interface";


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

  public addPost = async (request: Request, response: Response) => {

    try {

      const postDto: IPostDTO = {...request.body};

      const post = await this.postManager.addPost(postDto);
      response.status(201).send(post);

    } catch(err) {
      console.log(err);
      response.status(500).send({message: "Internal server error"});
    }
  }

  public getPost = async (request: Request, response: Response) => {

    try {
      
      const postId = +request.params.postId;

      if (isNaN(postId)) {
        return response.status(404).send({ message: "Invalid request" }); 
      }

      const post = await this.postManager.getPostById(postId);
      response.status(200).send(post);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(404).send({
          message: err.message,
          type: err.type
        });
      }

      response.status(500).send({ message: "Internal server error" });
    }
  }

  public modifyPost = async (request: Request, response: Response) => {

    try {
      
      const postDto: IPostDTO = {
        id: +request.params.postId,
        ...request.body
      };

      const post = await this.postManager.updatePost(postDto);
      response.status(200).send(post);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(404).send({
          message: err.message,
          type: err.type
        });
      }

      response.status(500).send({ message: "Internal server error" });
    }
  }
}