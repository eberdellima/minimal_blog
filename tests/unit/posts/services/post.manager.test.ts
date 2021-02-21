import { IPaginationDTO, ORDER_DIRECTION_ENUM } from '../../../../src/common/utilities/pagination.interface';
import { NanoIdSlugifier } from '../../../../src/common/utilities/slugifier';
import { Post } from '../../../../src/posts/models/post.entity';
import { PostRepository } from '../../../../src/posts/repositories/post.repository';
import { PostManager } from '../../../../src/posts/services/post.manager.service';
import { PostAlreadyExistsError, PostNotFoundError } from '../../../../src/posts/utilities/post.errors';
import { IPostDTO } from '../../../../src/posts/utilities/post.interface';

describe("unit testing PostManager", () => {

  describe("getPostById()", () => {
    test("should throw PostNotFoundError when no post found", async () => {

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn(async () => undefined);

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      try {
        await postManager.getPostById(1);
      } catch(err) {
        expect(err).toBeInstanceOf(PostNotFoundError);
      }
    });

    test("should return post for the provided id", async () => {

      const postRepository = new PostRepository();
      const post =  new Post();
      post.id = 1;
      post.title = "title";

      postRepository.findOne = jest.fn(async () => post);

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());
      const resultPost = await postManager.getPostById(post.id);

      expect(resultPost).toEqual(post);
    });
  });

  describe("getPostList()", () => {
    test("should return list of posts", async () => {

      const post = new Post();
      post.id = 1;
      post.title = "post title";

      const postList = [ [post], 1 ];

      const postRepository = new PostRepository();
      postRepository.getPosts = jest.fn().mockReturnValue(postList);

      const paginationDto: IPaginationDTO = {
        size: 1,
        offset: 0,
        orderBy: "id",
        orderDirection: ORDER_DIRECTION_ENUM.DESC
      };

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());
      const result = await postManager.getPostList(paginationDto);

      expect(result).toEqual(postList);
    });
  });

  describe("addPost()", () => {
    test("should throw PostAlreadyExistsError for post with existing title", async () => {

      const postRepository = new PostRepository();
      postRepository.getPostByTitle = jest.fn().mockReturnValue(new Post());

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      const postDto: IPostDTO = {
        title: "post title",
        description: "post description",
      };

      try {
        await postManager.addPost(postDto);
      } catch(err) {
        expect(err).toBeInstanceOf(PostAlreadyExistsError);
      }
    });

    test("should add new post", async () => {

      const postRepository = new PostRepository();
      postRepository.getPostByTitle = jest.fn().mockReturnValue(undefined);
      postRepository.save = jest.fn().mockImplementation((post: Post) => post);
      postRepository.create = jest.fn().mockImplementation((postPartial: Partial<Post>) => {
        const post = new Post();
        post.title = postPartial.title;
        post.description = postPartial.description;
        return post;
      });

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());
      
      const postDto: IPostDTO = {
        title: "post title",
        description: "post description",
      };

      const result = await postManager.addPost(postDto);

      expect(result.title).toEqual(postDto.title);
      expect(result.description).toEqual(postDto.description);
    });
  });

  describe("updatePost()", () => {
    test("should throw PostNotFoundError", async () => {

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockReturnValue(undefined);

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      const postDto: IPostDTO = {
        title: "post title",
        description: "post description",
      };

      try {
        await postManager.updatePost(postDto);
      } catch(err) {
        expect(err).toBeInstanceOf(PostNotFoundError);
      }
    });

    test("should modify existing post", async () => {

      const post = new Post();
      post.id = 1;
      post.title = "post title";

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockReturnValue(post);
      postRepository.save = jest.fn().mockImplementation((post: Post) => post);
      postRepository.merge = jest.fn().mockImplementation((post: Post, postPartial: Partial<Post>) => {
        return {...post, ...postPartial} as Post;
      });

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      const postDto: IPostDTO = {
        id: 1,
        title: " new post title",
        description: "post description",
      };

      const result = await postManager.updatePost(postDto);

      expect(result.title).toEqual(postDto.title);
      expect(result.description).toEqual(postDto.description);
    });
  });

  describe("deletePostById()", () => {
    test("should throw PostNotFoundError", async () => {

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockReturnValue(undefined);

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      try {
        await postManager.deletePostById(1);
      } catch(err) {
        expect(err).toBeInstanceOf(PostNotFoundError);
      }
    });

    test("should delete category with given id", async () => {

      const post = new Post();
      post.id = 1;

      let posts = [ post ];

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockReturnValue(post);
      postRepository.save = jest.fn().mockReturnValue(post);
      postRepository.delete = jest.fn().mockImplementation(({id}) => {
        posts = posts.filter(p => p.id !== id);
      });

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      await postManager.deletePostById(post.id);

      expect(posts.length).toBe(0);
    });
  });

  describe("modifyPostCategories()", () => {
    test("should throw PostNotFoundError", async () => {

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockReturnValue(undefined);

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      try {
        await postManager.modifyPostCategories(1, []);
      } catch(err) {
        expect(err).toBeInstanceOf(PostNotFoundError);
      }
    });

    test("should modify category list for a post", async () => {

      const post = new Post();
      post.id = 1;
      post.categories = [];

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockReturnValue(post);
      postRepository.save = jest.fn().mockReturnValue(post);
      postRepository.merge = jest.fn().mockImplementation((post: Post, postPartial: Partial<Post>) => {
        post.categories = postPartial.categories;
      });

      const categories = [
        {
          id: 1,
          name: "category name"
        }
      ];

      const postManager = new PostManager(postRepository, new NanoIdSlugifier());

      const result = await postManager.modifyPostCategories(post.id, categories);

      expect(result.id).toBe(post.id);
      expect(result.categories).toEqual(categories);
    });
  });
});