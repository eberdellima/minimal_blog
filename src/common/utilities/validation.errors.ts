import { HttpBadRequestError } from "./http.errors";


export class ValidationError extends HttpBadRequestError {
  constructor() {
    super()
    
    this._message = "validation error";
    this._type = "ValidationError";
  }
}