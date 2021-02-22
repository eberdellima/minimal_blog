import { HttpBadRequestError, HttpNotFoundError } from "../../common/utilities/http.errors";


export class CategoryNotFoundError extends HttpNotFoundError {
  constructor(message?: string) {
    super(message)
    
    this._message = "category not found";
    this._type = "CategoryNotFoundError";
    this._code = 404;
  }
}

export class CategoryAlreadyExistsError extends HttpBadRequestError {
  constructor(message?: string) {
    super(message)
    
    this._message = "category already exists";
    this._type = "CategoryAlreadyExists";
    this._code = 409;
  }
}