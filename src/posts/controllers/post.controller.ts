import { Request, Response } from "express";
import { HttpBadRequestError, HttpInternalServerError } from "../../common/utilities/http.errors";
import { Pagination } from "../../common/utilities/pagination";
import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { PostManager } from "../services/post.manager.service";
import { PostAlreadyExistsError, PostNotFoundError } from "../utilities/post.errors";
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
      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }

  public addPost = async (request: Request, response: Response) => {

    try {

      const postDto: IPostDTO = {...request.body};

      const post = await this.postManager.addPost(postDto);
      response.status(201).send(post);

    } catch(err) {

      if (err instanceof PostAlreadyExistsError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }

  public getPost = async (request: Request, response: Response) => {

    try {
      
      const postId = +request.params.postId;

      if (isNaN(postId)) {
        const badRequestError = new HttpBadRequestError();
        return response.status(badRequestError.code).send(badRequestError.getErrorResponse());
      }

      const post = await this.postManager.getPostById(postId);
      response.status(200).send(post);

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }

      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
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
        return response.status(err.code).send(err.getErrorResponse());
      }

      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }

  public deletePost = async (request: Request, response: Response) => {

    try {

      const postId: number = +request.params.postId;

      if (isNaN(postId)) {
        const badRequestError = new HttpBadRequestError();
        return response.status(badRequestError.code).send(badRequestError.getErrorResponse());
      }

      await this.postManager.deletePostById(postId);
      response.status(204).send();

    } catch(err) {

      if (err instanceof PostNotFoundError) {
        return response.status(err.code).send(err.getErrorResponse());
      }
      
      const serverError = new HttpInternalServerError();
      response.status(serverError.code).send(serverError.getErrorResponse());
    }
  }
}