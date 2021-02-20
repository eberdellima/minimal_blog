import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { PostRepository } from "../repositories/post.repository";


export class PostManager {

  private readonly postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  public getPostList = async (paginationDto: IPaginationDTO) => {
    return this.postRepository.getPosts(paginationDto);
  }
}