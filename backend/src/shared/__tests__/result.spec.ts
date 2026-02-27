import { Result } from '../result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful result', () => {
      const result = Result.ok('value');
      expect(result.isOk()).toBe(true);
      expect(result.isFail()).toBe(false);
      expect(result.getValue()).toBe('value');
    });
  });

  describe('fail', () => {
    it('should create a failed result', () => {
      const error = new Error('something went wrong');
      const result = Result.fail(error);
      expect(result.isOk()).toBe(false);
      expect(result.isFail()).toBe(true);
      expect(result.getError()).toBe(error);
    });
  });

  describe('getValue', () => {
    it('should throw if result is failed', () => {
      const result = Result.fail(new Error('fail'));
      expect(() => result.getValue()).toThrow('Cannot get value from a failed result');
    });
  });

  describe('getError', () => {
    it('should throw if result is ok', () => {
      const result = Result.ok('value');
      expect(() => result.getError()).toThrow('Cannot get error from a successful result');
    });
  });

  describe('andThen', () => {
    it('should chain successful operations', () => {
      const result = Result.ok(5)
        .andThen((val) => Result.ok(val * 2))
        .andThen((val) => Result.ok(val + 1));
      expect(result.getValue()).toBe(11);
    });

    it('should stop chain on failure', () => {
      const result = Result.ok(5)
        .andThen(() => Result.fail<number>(new Error('failed')))
        .andThen((val) => Result.ok(val + 1));
      expect(result.isFail()).toBe(true);
      expect(result.getError().message).toBe('failed');
    });
  });
});