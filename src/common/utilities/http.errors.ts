import { HttpError } from "./errors";

export class HttpInternalServerError extends HttpError {
  constructor(message?: string) {
    super(message)
    
    this._message = message ? message : "internal server error";
    this._type = "InternalServerError";
    this._code = 500;
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(message?: string) {
    super(message)
    
    this._message = message ? message : "not found";
    this._type = "NotFoundError";
    this._code = 404;
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(message?: string) {
    super(message)
    
    this._message = message ? message : "bad request";
    this._type = "BadRequestError";
    this._code = 400;
  }
}