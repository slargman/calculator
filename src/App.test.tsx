import {
  checkDecimal,
  checkNegative,
  countDigits,
  formatOperand,
} from './lib/utilities';

describe('utilities', () => {
  describe('countDigits', () => {
    it('should count digits correctly', () => {
      expect(countDigits('1000')).toEqual(4);
      expect(countDigits('1,000')).toEqual(4);
      expect(countDigits('-1,000')).toEqual(4);
      expect(countDigits('-1,000.0')).toEqual(5);
    });
  });

  describe('checkDecimal', () => {
    it('should check decimals correctly', () => {
      expect(checkDecimal('-1,000')).toBe(false);
      expect(checkDecimal('-1,000.10')).toBe(true);
      expect(checkDecimal('1,000.88')).toBe(true);
    });
  });

  describe('checkNegative', () => {
    it('should check decimals correctly', () => {
      expect(checkNegative('1,000')).toBe(false);
      expect(checkNegative('1,000.88')).toBe(false);
      expect(checkNegative('-1,000')).toBe(true);
      expect(checkNegative('-1,000.10')).toBe(true);
    });
  });

  describe('formatOperand', () => {
    it('should format operands correctly', () => {
      expect(formatOperand('008')).toBe('8');
      expect(formatOperand('008.0')).toBe('8.0');
      expect(formatOperand('-8.')).toBe('-8.');
      expect(formatOperand('-8.0')).toBe('-8.0');
      expect(formatOperand('123456789')).toBe('123,456,789');
      expect(formatOperand('123456789.')).toBe('123,456,789');
      expect(formatOperand('123456789.0')).toBe('123,456,789');
      expect(formatOperand('123.4567890')).toBe('123.456789');
    });
  });
});
