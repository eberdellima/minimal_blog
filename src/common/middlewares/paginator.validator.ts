import { NextFunction, Request, Response } from "express";
import { Pagination } from "../utilities/pagination";
import { IPagination } from "../utilities/pagination.interface";


export class PaginationValidator {

  public validate() {
    return async (request: Request, response: Response, next: NextFunction) => {

      try {
        const queryData: unknown = request.query;
        response.locals.pagination = new Pagination(queryData as IPagination);
      } catch(err) {
        response.status(400).send({message: "Invalid request"});
      }

      next();
    }
  }
}