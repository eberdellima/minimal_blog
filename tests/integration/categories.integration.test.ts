import supertest from "supertest";
import { Connection, createConnection } from "typeorm";
import express from "express";
import { loadServerConfiguration } from '../../src/loaders/server';
import { loadRouters } from '../../src/loaders/router';
import { Category } from "../../src/categories/models/category.entity";

jest.useFakeTimers();


describe("testing categories router", () => {

  let connection: Connection;

  const app = express();

  beforeAll(async () => {
    connection = await createConnection("test");

    loadServerConfiguration(app);
    loadRouters(app, connection);
  });

  afterAll(async () => {
    connection.close();
  });

  test("GET /categories should return list of categories", async () => {

    const categoryRepository = connection.getRepository(Category);
    const category = await categoryRepository.save({name: "test_name"});

    const response = await supertest(app).get('/categories');

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.categories).toBeDefined();
    expect(response.body.categories.length).toEqual(1);
    expect(response.body.total).toBeDefined();
    expect(response.body.total).toEqual(1);
    expect(response.body.categories[0].name).toEqual(category.name);

    await categoryRepository.delete(category);
  });
});