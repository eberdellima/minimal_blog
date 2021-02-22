import { NextFunction, Request, Response } from "express";
import { HttpBadRequestError } from "../utilities/http.errors";
import { Pagination } from "../utilities/pagination";
import { IPagination } from "../utilities/pagination.interface";


export class PaginationValidator {

  public validate() {
    return async (request: Request, response: Response, next: NextFunction) => {

      try {
        const queryData: unknown = request.query;
        response.locals.pagination = new Pagination(queryData as IPagination);
      } catch(err) {
        const badRequestError = new HttpBadRequestError();
        response.status(badRequestError.code).send(badRequestError.getErrorResponse());
      }

      next();
    }
  }
}