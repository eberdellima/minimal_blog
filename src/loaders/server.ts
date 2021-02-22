import { Application, Request, Response } from "express";
import * as bodyParser from "body-parser";


export function loadServerConfiguration(app: Application) {

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get("/", (request: Request, response: Response) => {
    response.status(200).send(
      {
        success: true,
        message: "the api call is successfull",
      }
    );
  });

}