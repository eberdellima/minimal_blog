

export class BaseError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class HttpError extends BaseError {
  
  protected _message: string = "";
  protected _type: string = "";
  protected _code: number = 0;
  protected _details: unknown[] = [];
  
  constructor(message?: string) {
    super(message);
  }

  public get code(): number {
    return this._code;
  }

  public set details(details: unknown[]) {
    this._details = details;
  }

  public getErrorResponse() {
    return {
      message: this._message,
      type: this._type,
      code: this._code,
      details: this._details
    }
  }
}