import { HttpInternalServerError } from './../utilities/http.errors';

export class BaseController {

  protected readonly internalServerError: HttpInternalServerError;

  constructor() {
    this.internalServerError = new HttpInternalServerError();
  }
}