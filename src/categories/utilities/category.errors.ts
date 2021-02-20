import { BaseError } from "../../common/utilities/errors";


export class CategoryNotFoundError  extends BaseError {

  private _message: string = "Category not found";
  private _type: string = "CategoryNotFoundError";

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