import "reflect-metadata";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import express, { Request, Response } from "express";
import { loadRouters } from "./loaders/router";

dotenv.config();
createConnection().then(async() => {

  const app = express();
  loadRouters(app);

  app.get("/", (request: Request, response: Response) => {
    response.status(200).send(
      {
        success: true,
        message: "the api call is successfull",
      }
    )
  });

  const port = process.env.PORT || "3000";

  app.listen(port, () => console.log(`Server running on port: ${port}`));
});