import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { Slugifier } from "../../common/utilities/slugifier";
import { PostRepository } from "../repositories/post.repository";
import { IPostDTO } from "../utilities/post.interface";


export class PostManager {

  private readonly postRepository: PostRepository;
  private readonly slugifier: Slugifier;

  constructor(postRepository: PostRepository, slugifier: Slugifier) {
    this.postRepository = postRepository;
    this.slugifier = slugifier;
  }

  public getPostList = async (paginationDto: IPaginationDTO) => {
    return this.postRepository.getPosts(paginationDto);
  }

  public addPost = async (postDto: IPostDTO) => {

    if (postDto.slug) {
      const postExists = await this.postRepository.getPostBySlug(postDto.slug);

      if (postExists) {
        postDto.slug = this.slugifier.slugify(postDto.title);
      }
    }

    const newPost = this.postRepository.create(postDto);
    return this.postRepository.save(newPost);
  }
}