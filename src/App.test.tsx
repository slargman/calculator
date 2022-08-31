import {
  checkDecimal,
  checkNegative,
  checkScientificNotation,
  countDigits,
  evaluate,
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

  describe('checkScientificNotation', () => {
    it('should check scientific notation correctly', () => {
      expect(checkScientificNotation('1,000')).toBe(false);
      expect(checkScientificNotation('-1,000')).toBe(false);
      expect(checkScientificNotation('-1.0e8')).toBe(true);
    });
  });

  describe('formatOperand', () => {
    it('should format operands correctly', () => {
      expect(formatOperand('008')).toStrictEqual([false, '8']);
      expect(formatOperand('008.0')).toStrictEqual([false, '8.0']);
      expect(formatOperand('-8.')).toStrictEqual([false, '-8.']);
      expect(formatOperand('-8.0')).toStrictEqual([false, '-8.0']);
      expect(formatOperand('123456789')).toStrictEqual([false, '123,456,789']);
      expect(formatOperand('123456789.')).toStrictEqual([false, '123,456,789']);
      expect(formatOperand('123456789.0')).toStrictEqual([
        false,
        '123,456,789',
      ]);
      expect(formatOperand('123.4567890')).toStrictEqual([false, '123.456789']);
      expect(formatOperand('-0.0000000017')).toStrictEqual([true, '0']);
      expect(formatOperand('1e-7')).toStrictEqual([false, '0.0000001']);
      expect(formatOperand('-1e-7')).toStrictEqual([false, '-0.0000001']);
    });
  });

  describe('evaluate', () => {
    it('should evaluate expressions correctly', () => {
      expect(evaluate('-0.0000017', '/', '100')).toStrictEqual([
        false,
        '-0.00000001',
      ]);
      expect(evaluate('-0.0000017', '/', '1000')).toStrictEqual([true, '0']);
    });
  });
});
