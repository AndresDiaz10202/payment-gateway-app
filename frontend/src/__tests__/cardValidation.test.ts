import {
  isValidLuhn,
  detectCardBrand,
  isValidExpiry,
  isValidCvc,
  isValidCardHolder,
  formatCardNumber,
} from '../utils/cardValidation';

describe('isValidLuhn', () => {
  it('should validate test card 4242424242424242', () => {
    expect(isValidLuhn('4242424242424242')).toBe(true);
  });

  it('should validate test card 4111111111111111', () => {
    expect(isValidLuhn('4111111111111111')).toBe(true);
  });

  it('should reject invalid number', () => {
    expect(isValidLuhn('1234567890123456')).toBe(false);
  });

  it('should handle spaces', () => {
    expect(isValidLuhn('4242 4242 4242 4242')).toBe(true);
  });
});

describe('detectCardBrand', () => {
  it('should detect Visa', () => {
    expect(detectCardBrand('4242424242424242')).toBe('visa');
  });

  it('should detect Mastercard starting with 51', () => {
    expect(detectCardBrand('5100000000000000')).toBe('mastercard');
  });

  it('should detect Mastercard starting with 55', () => {
    expect(detectCardBrand('5500000000000000')).toBe('mastercard');
  });

  it('should detect Mastercard starting with 22', () => {
    expect(detectCardBrand('2200000000000000')).toBe('mastercard');
  });

  it('should return unknown for other cards', () => {
    expect(detectCardBrand('6200000000000000')).toBe('unknown');
  });
});

describe('isValidExpiry', () => {
  it('should accept future date', () => {
    expect(isValidExpiry('12', '29')).toBe(true);
  });

  it('should reject past date', () => {
    expect(isValidExpiry('01', '20')).toBe(false);
  });

  it('should reject invalid month', () => {
    expect(isValidExpiry('13', '29')).toBe(false);
  });

  it('should reject month 0', () => {
    expect(isValidExpiry('00', '29')).toBe(false);
  });
});

describe('isValidCvc', () => {
  it('should accept 3 digits', () => {
    expect(isValidCvc('123')).toBe(true);
  });

  it('should reject 2 digits', () => {
    expect(isValidCvc('12')).toBe(false);
  });

  it('should reject letters', () => {
    expect(isValidCvc('abc')).toBe(false);
  });
});

describe('isValidCardHolder', () => {
  it('should accept valid name', () => {
    expect(isValidCardHolder('PEDRO PEREZ')).toBe(true);
  });

  it('should accept name with accents', () => {
    expect(isValidCardHolder('JOSÉ MARÍA')).toBe(true);
  });

  it('should reject short name', () => {
    expect(isValidCardHolder('AB')).toBe(false);
  });

  it('should reject numbers', () => {
    expect(isValidCardHolder('PEDRO123')).toBe(false);
  });
});

describe('formatCardNumber', () => {
  it('should format with spaces every 4 digits', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
  });

  it('should remove non-digits', () => {
    expect(formatCardNumber('4242-4242')).toBe('4242 4242');
  });

  it('should limit to 16 digits', () => {
    expect(formatCardNumber('42424242424242421234')).toBe('4242 4242 4242 4242');
  });
});