import supertest from "supertest";
import express from "express";
import { Connection, createConnection } from "typeorm";
import { loadServerConfiguration } from '../../src/loaders/server';
import { loadRouters } from '../../src/loaders/router';
import { PostRepository } from "../../src/posts/repositories/post.repository";
import { CategoryRepository } from "../../src/categories/repositories/category.repository";
import { CONNECTION_NAME } from "../utilities/connection.name.enum";

jest.useFakeTimers();

describe("testing posts router", () => {

  let connection: Connection;
  let postRepository: PostRepository;
  let categoryRepository: CategoryRepository;

  const app = express();

  beforeAll(async () => {
    connection = await createConnection(CONNECTION_NAME.TEST);

    loadServerConfiguration(app);
    loadRouters(app, connection);

    postRepository = connection.getCustomRepository(PostRepository);
    categoryRepository = connection.getCustomRepository(CategoryRepository);
  });

  afterAll(async () => {
    connection.close();
  });

  describe("GET /posts", () => {
    test("should return list of posts", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug",
      });

      const response = await supertest(app).get('/posts');

      await postRepository.delete({ id: post.id });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.posts).toBeDefined();
      expect(response.body.posts.length).toBeDefined();
      expect(response.body.posts.length).toEqual(1);
      expect(response.body.total).toBeDefined();
      expect(response.body.total).toEqual(1);
      expect(response.body.posts[0].id).toEqual(post.id);
      expect(response.body.posts[0].title).toEqual(post.title);
      expect(response.body.posts[0].description).toEqual(post.description);
      expect(response.body.posts[0].slug).toEqual(post.slug);
      expect(response.body.posts[0].createdAt).toBeDefined();
      expect(response.body.posts[0].updatedAt).toBeDefined();
      expect(response.body.posts[0].categories).toBeDefined();
      expect(response.body.posts[0].categories.length).toEqual(0);
    });
  });

  describe("POST /posts", () => {
    test("should insert new post", async () => {

      const postData = {
        title: "post title",
        description: "post description",
      };

      const response = await supertest(app).post('/posts').send(postData);

      await postRepository.delete({ id: response.body.id });

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toEqual(postData.title);
      expect(response.body.description).toEqual(postData.description);
      expect(response.body.slug).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
    });

    test("should throw validation error", async () => {

      const postData = {
        description: "post description",
      };

      const response = await supertest(app).post('/posts').send(postData);

      expect(response.status).toBe(400);
    });


    test("should throw bad request error from non existing category", async () => {

      const category = await categoryRepository.save({ name: "category" });
      await categoryRepository.delete({ id: category.id });

      const postData = {
        title: "post title",
        description: "post description",
        categories: [
          {
            id: category.id,
            name: category.name
          },
        ],
      };

      const response = await supertest(app).post('/posts').send(postData);

      expect(response.status).toBe(404);
    });

    test("should should throw post already exists error", async () => {

      const oldPost = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const postData = {
        title: oldPost.title,
        description: oldPost.description
      };

      const response = await supertest(app).post('/posts').send(postData);

      expect(response.status).toBe(409);

      await postRepository.delete({ id: oldPost.id });
    });
  });

  describe("GET /posts/:postId", () => {
    test("should return post", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const response = await supertest(app).get('/posts/' + post.id);

      await postRepository.delete({ id: post.id });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(post.id);
      expect(response.body.title).toEqual(post.title);
      expect(response.body.description).toEqual(post.description);
      expect(response.body.slug).toEqual(post.slug);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.categories).toBeDefined();
      expect(response.body.categories.length).toBe(0);
    });

    test("should throw post not found error", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      await postRepository.delete({ id: post.id });

      const response = await supertest(app).get('/posts/' + post.id);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /posts/:postId", () => {
    test("should modify post", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const postUpdateData = {
        title: "new title",
      };

      const response = await supertest(app).patch('/posts/' + post.id).send(postUpdateData);

      await postRepository.delete({ id: post.id });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(post.id);
      expect(response.body.title).toEqual(postUpdateData.title);
      expect(response.body.description).toEqual(post.description);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.categories).toBeDefined();
      expect(response.body.categories.length).toBe(0);
    });

    test("should throw validation error", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const postUpdateData = {
        title: 100,
      };

      const response = await supertest(app).patch('/posts/' + post.id).send(postUpdateData);

      await postRepository.delete({ id: post.id });

      expect(response.status).toBe(400);
    });

    test("should throw not found error", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      await postRepository.delete({ id: post.id });

      const postUpdateData = {
        title: "new title",
      };

      const response = await supertest(app).patch('/posts/' + post.id).send(postUpdateData);

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /posts/:postId", () => {
    test("should delete post", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const response = await supertest(app).delete('/posts/' + post.id);

      expect(response.status).toBe(204);

      const fetchedPost = await postRepository.findOne({ id: post.id });

      expect(fetchedPost).toBeUndefined();
    });

    test("should throw post not found error", async () => {

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      await postRepository.delete({ id: post.id });

      const response = await supertest(app).delete('/posts/' + post.id);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /posts/:postId/categories", () => {
    test("should throw validation error", async () => {

      const categoryData = [
        {
          id: 1
        },
      ];

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const response = await supertest(app).patch('/posts/' + post.id + '/categories').send({ categories: categoryData });

      await postRepository.delete({ id: post.id });

      expect(response.status).toBe(400);
    });

    test("should throw category not found error", async () => {
      
      const categoryData = [
        {
          id: 1,
          name: "sample category",
        },
      ];

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const response = await supertest(app).patch('/posts/' + post.id + '/categories').send({ categories: categoryData });

      await postRepository.delete({ id: post.id });

      expect(response.status).toBe(404);
    });

    test("should throw post not found error", async () => {

      const categoryData = [
        {
          id: 1,
          name: "sample category",
        },
      ];

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      await postRepository.delete({ id: post.id });

      const response = await supertest(app).patch('/posts/' + post.id + '/categories').send({ categories: categoryData });

      expect(response.status).toBe(404);
    });

    test("should modify post categories", async () => {

      const category = await categoryRepository.save({ name: "sample category" });

      const post = await postRepository.save({
        title: "post title",
        description: "post description",
        slug: "post slug"
      });

      const categoryData = [
        {
          id: category.id,
          name: category.name,
        },
      ];

      const response = await supertest(app).patch('/posts/' + post.id + '/categories').send({ categories: categoryData });

      await categoryRepository.delete({ id: category.id });
      await postRepository.delete({ id: post.id });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(post.id);
      expect(response.body.title).toEqual(post.title);
      expect(response.body.description).toEqual(post.description);
      expect(response.body.slug).toEqual(post.slug);
      expect(response.body.categories).toBeDefined();
      expect(response.body.categories.length).toEqual(1);
      expect(response.body.categories[0].id).toEqual(category.id);
      expect(response.body.categories[0].name).toEqual(category.name);
    });
  });
});