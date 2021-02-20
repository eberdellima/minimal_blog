import { BaseError } from "../../common/utilities/errors";


export class PostNotFoundError extends BaseError {

  private _message: string = "Post not found";
  private _type: string = "PostNotFoundError";

  constructor(message?: string) {
    super(message);
  }

  get message(): string {
    return this._message;
  }

  set message(message: string) {
    this._message = message;
  }

  get type(): string {
    return this._type;
  }
}