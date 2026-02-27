export class DomainError {
  constructor(
    public readonly code: string,
    public readonly message: string,
  ) {}

  static create(code: string, message: string): DomainError {
    return new DomainError(code, message);
  }
}