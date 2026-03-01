import { formatCOP } from '../utils/formatCurrency';

describe('formatCOP', () => {
  it('should format cents to COP', () => {
    const result = formatCOP(499900000);
    expect(result).toContain('4.999.000');
  });

  it('should format zero', () => {
    const result = formatCOP(0);
    expect(result).toContain('0');
  });

  it('should format base fee', () => {
    const result = formatCOP(500000);
    expect(result).toContain('5.000');
  });
});