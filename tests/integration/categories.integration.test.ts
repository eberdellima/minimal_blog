import supertest from "supertest";
import { Connection, createConnection } from "typeorm";
import express from "express";
import { loadServerConfiguration } from '../../src/loaders/server';
import { loadRouters } from '../../src/loaders/router';
import { Category } from "../../src/categories/models/category.entity";
import { CategoryRepository } from "../../src/categories/repositories/category.repository";
import { CONNECTION_NAME } from "../utilities/connection.name.enum";

jest.useFakeTimers();

describe("testing categories router", () => {

  let connection: Connection;
  let categoryRepository: CategoryRepository;
  let category: Category;

  const app = express();

  beforeAll(async () => {
    connection = await createConnection(CONNECTION_NAME.TEST);

    loadServerConfiguration(app);
    loadRouters(app, connection);

    categoryRepository = connection.getCustomRepository(CategoryRepository);
    category = await categoryRepository.save({name: "test_name"});
  });

  afterAll(async () => {
    await categoryRepository.delete(category);
    connection.close();
  });

  describe("GET /categories", () => {
    test("should return list of categories", async () => {

      const response = await supertest(app).get('/categories');
  
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.categories).toBeDefined();
      expect(response.body.categories.length).toEqual(1);
      expect(response.body.total).toBeDefined();
      expect(response.body.total).toEqual(1);
      expect(response.body.categories[0].name).toEqual(category.name);
    });
  });

  describe("POST /categories", () => {
    test("should insert new category", async() => {

      const newCategory = {
        name: "new category"
      };

      const response = await supertest(app).post('/categories').send({ name: newCategory.name });

      await categoryRepository.delete({ id: response.body.id });

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toEqual(newCategory.name);
    });

    test("should throw validation error", async() => {

      const response = await supertest(app).post('/categories');

      expect(response.status).toBe(400);
    });

    test("should throw category exists error", async() => {

      const oldCategory = await categoryRepository.save({ name: "old category" });

      const response = await supertest(app).post('/categories').send({ name: oldCategory.name });

      await categoryRepository.delete(oldCategory);

      expect(response.status).toBe(409);
    });
  });

  describe("GET /categories/:categoryId", () => {
    test("should return category", async () => {

      const response = await supertest(app).get('/categories/' + category.id);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.id).toEqual(category.id);
      expect(response.body.name).toBeDefined();
      expect(response.body.name).toEqual(category.name);
    });

    test("should throw not found error", async () => {

      const response = await supertest(app).get('/categories/0');

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /categories/:categoryId", () => {
    test("should modify category", async() => {

      const newCategory = await categoryRepository.save({ name: "first name" });

      const newName = "modified name";
      const response = await supertest(app).patch('/categories/' + newCategory.id).send({ name: newName });

      await categoryRepository.delete({ id: newCategory.id});

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.id).toEqual(newCategory.id);
      expect(response.body.name).toEqual(newName);
    });

    test("should throw validation error", async () => {

      const response = await supertest(app).patch('/categories/' + category.id);

      expect(response.status).toBe(400);
    });

    test("should throw not found error", async () => {

      const newCategory = await categoryRepository.save({ name: "first name" });
      await categoryRepository.delete({ id: newCategory.id });

      const response = await supertest(app).patch('/categories/' + newCategory.id).send({ name: "custom name" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /categories/:categoryId", () => {
    test("should delete category", async () => {

      const categoryToDelete = await categoryRepository.save({ name: "category to delete" });

      const response = await supertest(app).delete('/categories/' + categoryToDelete.id);

      expect(response.status).toBe(204);

      const fetchedCategoryResult = await categoryRepository.findOne({ id: categoryToDelete.id });

      expect(fetchedCategoryResult).toBeUndefined();
    });

    test("should throw not found error", async () => {

      const newCategory = await categoryRepository.save({ name: "first name" });
      await categoryRepository.delete({ id: newCategory.id });

      const response = await supertest(app).delete('/caetgories/' + newCategory.id);

      expect(response.status).toBe(404);
    });
  });
});

