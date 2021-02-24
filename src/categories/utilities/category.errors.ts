import { HttpConflictError, HttpNotFoundError } from "../../common/utilities/http.errors";


export class CategoryNotFoundError extends HttpNotFoundError {
  constructor(message?: string) {
    super(message)
    
    this._message = "category not found";
    this._type = "CategoryNotFoundError";
  }
}

export class CategoryAlreadyExistsError extends HttpConflictError {
  constructor(message?: string) {
    super(message)
    
    this._message = "category already exists";
    this._type = "CategoryAlreadyExists";
  }
}