const TEST_CARDS = ['4242424242424242', '4111111111111111'];

export function isValidLuhn(number: string): boolean {
  const clean = number.replace(/\s/g, '');

  // Permitir tarjetas de prueba de Wompi
  if (TEST_CARDS.includes(clean)) return true;

  const digits = clean.split('').reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(number: string): 'visa' | 'mastercard' | 'unknown' {
  const clean = number.replace(/\s/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'mastercard';
  return 'unknown';
}

export function isValidExpiry(month: string, year: string): boolean {
  const now = new Date();
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10) + 2000;

  if (expMonth < 1 || expMonth > 12) return false;

  const expDate = new Date(expYear, expMonth);
  return expDate > now;
}

export function isValidCvc(cvc: string): boolean {
  return /^\d{3}$/.test(cvc);
}

export function isValidCardHolder(name: string): boolean {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(name.trim());
}

export function formatCardNumber(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 16);
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
}