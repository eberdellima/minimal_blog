import "reflect-metadata";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import express from "express";
import { loadRouters } from "./loaders/router";
import { loadServerConfiguration } from "./loaders/server";

dotenv.config();
createConnection().then(async() => {

  const app = express();
  loadServerConfiguration(app);
  loadRouters(app);

  const port = process.env.PORT || "3000";

  app.listen(port, () => console.log(`Server running on port: ${port}`));
});