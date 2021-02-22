import { FindConditions, FindOneOptions } from "typeorm";
import { IPaginationDTO, ORDER_DIRECTION_ENUM } from "../../../../src/common/utilities/pagination.interface";
import { Post } from "../../../../src/posts/models/post.entity";
import { PostRepository } from '../../../../src/posts/repositories/post.repository';


describe("unit testing PostRepository", () => {

  describe("getPosts()", () => {
    test("should return list of posts", async () => {

      const posts = [
        [new Post()],
        1
      ];

      const postRepository = new PostRepository();

      postRepository.createQueryBuilder = jest.fn().mockReturnValue({
        take: jest.fn().mockReturnValueOnce(this),
        skip: jest.fn().mockReturnValueOnce(this),
        orderBy: jest.fn().mockReturnValueOnce(this),
        leftJoinAndMapMany: jest.fn().mockReturnValueOnce({
          getManyAndCount: jest.fn().mockReturnValueOnce(posts)
        }),
      });
  
      const paginationDto: IPaginationDTO = {
        size: 1,
        offset: 0,
        orderBy: "id",
        orderDirection: ORDER_DIRECTION_ENUM.DESC
      };
  
      const result = await postRepository.getPosts(paginationDto);
      expect(result).toEqual(posts);
    });
  });

  describe("getPostBySlug()", () => {
    test("should return post with given slug", async () => {

      const post1 = new Post();
      post1.slug = "post-1";

      const post2 = new Post();
      post2.slug = "post-2";

      const post3 = new Post();
      post3.slug = "post-3";

      const postList = [
        post1,
        post2,
        post3,
      ];

      const customFindOne = jest.fn((options: FindOneOptions) => {

        const postFindOptions: FindConditions<Post> = <FindConditions<Post>>options.where;
        const postSlug: string = <string>postFindOptions.slug;
        
        return postList.find(p => p.slug === postSlug);
      });

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockImplementation(customFindOne);

      const result = await postRepository.getPostBySlug(post2.slug);

      expect(result).toEqual(post2);
    });
  });

  describe("getPostByTitle()", () => {
    test("should return post by given title", async () => {

      const post1 = new Post();
      post1.title = "post-1";

      const post2 = new Post();
      post2.title = "post-2";

      const post3 = new Post();
      post3.title = "post-3";

      const postList = [
        post1,
        post2,
        post3,
      ];

      const customFindOne = jest.fn((options: FindOneOptions) => {

        const postFindOptions: FindConditions<Post> = <FindConditions<Post>>options.where;
        const postTitle: string = <string>postFindOptions.title;
        
        return postList.find(p => p.title === postTitle);
      });

      const postRepository = new PostRepository();
      postRepository.findOne = jest.fn().mockImplementation(customFindOne);

      const result = await postRepository.getPostByTitle(post3.title);

      expect(result).toEqual(post3);
    });
  });
});