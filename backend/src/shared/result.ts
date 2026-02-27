export class Result<T, E = Error> {
  private constructor(
    private readonly _isOk: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}

  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  static fail<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  isOk(): boolean {
    return this._isOk;
  }

  isFail(): boolean {
    return !this._isOk;
  }

  getValue(): T {
    if (this.isFail()) {
      throw new Error('Cannot get value from a failed result');
    }
    return this._value as T;
  }

  getError(): E {
    if (this.isOk()) {
      throw new Error('Cannot get error from a successful result');
    }
    return this._error as E;
  }

  andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isFail()) {
      return Result.fail(this._error as E);
    }
    return fn(this._value as T);
  }

  async andThenAsync<U>(fn: (value: T) => Promise<Result<U, E>>): Promise<Result<U, E>> {
    if (this.isFail()) {
      return Result.fail(this._error as E);
    }
    return fn(this._value as T);
  }
}