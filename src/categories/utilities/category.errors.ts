import { HttpNotFoundError } from "../../common/utilities/http.errors";


export class CategoryNotFoundError extends HttpNotFoundError {
  constructor(message?: string) {
    super(message)
    
    this._message = "category not found";
    this._type = "CategoryNotFoundError";
    this._code = 404;
  }
}