import { DomainError } from '../errors/domain-error';

describe('DomainError', () => {
  it('should create a domain error with code and message', () => {
    const error = DomainError.create('TEST_ERROR', 'Something failed');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.message).toBe('Something failed');
  });

  it('should create via constructor', () => {
    const error = new DomainError('CODE', 'msg');
    expect(error.code).toBe('CODE');
    expect(error.message).toBe('msg');
  });
});