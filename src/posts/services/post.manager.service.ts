import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { PostRepository } from "../repositories/post.repository";
import { IPostDTO } from "../utilities/post.interface";


export class PostManager {

  private readonly postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public getPostList = async (paginationDto: IPaginationDTO) => {
    return this.postRepository.getPosts(paginationDto);
  }

  public addPost = async (postDto: IPostDTO) => {

    // TODO: add post slug generation

    const newPost = this.postRepository.create(postDto);
    return this.postRepository.save(newPost);
  }
}