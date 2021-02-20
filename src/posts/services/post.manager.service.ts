import { IPaginationDTO } from "../../common/utilities/pagination.interface";
import { Slugifier } from "../../common/utilities/slugifier";
import { PostRepository } from "../repositories/post.repository";
import { PostNotFoundError } from "../utilities/post.errors";
import { IPostDTO } from "../utilities/post.interface";


export class PostManager {

  private readonly postRepository: PostRepository;
  private readonly slugifier: Slugifier;

  constructor(postRepository: PostRepository, slugifier: Slugifier) {
    this.postRepository = postRepository;
    this.slugifier = slugifier;
  }

  public getPostById = async (postId: number) => {

    const post = await this.postRepository.findOne(postId);

    if (post === undefined) {
      throw new PostNotFoundError();
    }

    return post;
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

    postDto.title = postDto.title.trim();
    postDto.description = postDto.description.trim();

    const newPost = this.postRepository.create(postDto);
    return this.postRepository.save(newPost);
  }

  public updatePost = async (postDto: IPostDTO) => {

    const post = await this.getPostById(postDto.id);

    if (post.title !== postDto.title.trim()) {
      postDto.slug = this.slugifier.slugify(postDto.title);
    }

    const updatedPost = this.postRepository.merge(post, postDto);

    return this.postRepository.save(updatedPost);
  }

  public deletePostById = async (postId: number) => {

    const post = await this.getPostById(postId);

    post.categories = [];
    await this.postRepository.save(post);
    return this.postRepository.delete({ id: postId });
  }
}