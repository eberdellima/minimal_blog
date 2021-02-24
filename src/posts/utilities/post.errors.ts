import { HttpConflictError, HttpNotFoundError } from "../../common/utilities/http.errors";


export class PostNotFoundError extends HttpNotFoundError {
  constructor(message?: string) {
    super(message)
    
    this._message = "post not found";
    this._type = "PostNotFoundError";
  }
}

export class PostAlreadyExistsError extends HttpConflictError {
  constructor(message?: string) {
    super(message)
    
    this._message = "post already exists";
    this._type = "PostAlreadyExists";
  }
}