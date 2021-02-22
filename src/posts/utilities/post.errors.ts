import { HttpBadRequestError, HttpNotFoundError } from "../../common/utilities/http.errors";


export class PostNotFoundError extends HttpNotFoundError {
  constructor(message?: string) {
    super(message)
    
    this._message = "post not found";
    this._type = "PostNotFoundError";
    this._code = 404;
  }
}

export class PostAlreadyExistsError extends HttpBadRequestError {
  constructor(message?: string) {
    super(message)
    
    this._message = "post already exists";
    this._type = "PostAlreadyExists";
    this._code = 409;
  }
}