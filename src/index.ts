import "reflect-metadata";
import * as dotenv from "dotenv";
import { Connection, createConnection } from "typeorm";
import express from "express";
import { loadRouters } from "./loaders/router";
import { loadServerConfiguration } from "./loaders/server";

dotenv.config();
createConnection().then(async(connection: Connection) => {

  const app = express();
  loadServerConfiguration(app);
  loadRouters(app, connection);

  const port = process.env.PORT || "3000";

  app.listen(port, () => console.log(`Server running on port: ${port}`));
});