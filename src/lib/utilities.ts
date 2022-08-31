export const MAX_INPUT_LENGTH = 9;

export function countDigits(operand: string) {
  const digitRegex = new RegExp('\\d');
  const filteredDigits = operand
    .split('')
    .filter((char) => digitRegex.test(char));
  return filteredDigits.length;
}

export function checkDecimal(operand: string) {
  return operand.includes('.');
}

export function checkNegative(operand: string) {
  return operand[0] === '-';
}

export function checkScientificNotation(operand: string) {
  return operand.includes('e');
}

function filterCommas(operand: string) {
  return operand
    .split('')
    .filter((char) => char !== ',')
    .join('');
}

function addCommas(integer: string) {
  let withCommas = '';

  for (let i = integer.length - 1; i >= 0; i--) {
    const j = integer.length - 1 - i;
    if (j === 3 || j === 6) {
      withCommas = ',' + withCommas;
    }
    withCommas = integer[i] + withCommas;
  }

  return withCommas;
}

function trimLeadingZeros(integer: string) {
  let trimmed = '';
  let nonZeroDigitFound = false;

  for (let i = 0; i < integer.length; i++) {
    const digit = integer[i];
    if (digit !== '0') nonZeroDigitFound = true;
    if (nonZeroDigitFound) trimmed = trimmed + digit;
  }

  return trimmed === '' ? '0' : trimmed;
}

function getExponent(operand: string) {
  if (!checkScientificNotation(operand)) return 0;
  return Number(operand.split('e')[1]);
}

function adjustByExponent(integer: string, fraction: string, exponent: number) {
  if (exponent === 0) return [integer, fraction];

  for (let i = 0; i < Math.abs(exponent); i++) {
    if (exponent > 0) {
      const transfer = fraction[0] || '0';
      integer = integer + transfer;
      fraction = fraction.substring(1);
    } else {
      const transfer = integer[integer.length - 1] || '0';
      fraction = transfer + fraction;
      integer = integer.substring(0, integer.length - 1) || '0';
    }
  }

  const nonZeroRegex = /[^0]/;

  if (!nonZeroRegex.test(fraction)) {
    fraction = '';
  }

  return [integer, fraction];
}

export function formatOperand(operand: string): [boolean, string] {
  operand = filterCommas(operand);
  const number = Number(operand);

  if (
    Math.abs(number) >= 10 ** MAX_INPUT_LENGTH ||
    (Math.abs(number) <= 10 ** -(MAX_INPUT_LENGTH - 1) && number !== 0)
  ) {
    return [true, '0'];
  }

  const operandIsNegative = checkNegative(operand);

  const prefix = operandIsNegative ? '-' : '';

  const operandParts = operand.split(/\D/);
  let integerPart = operandIsNegative ? operandParts[1] : operandParts[0];
  integerPart = integerPart || '0';
  integerPart = trimLeadingZeros(integerPart);

  let fractionPart = operandIsNegative ? operandParts[2] : operandParts[1];
  fractionPart = fractionPart || '';

  const exponent = getExponent(operand);
  [integerPart, fractionPart] = adjustByExponent(
    integerPart,
    fractionPart,
    exponent
  );

  const operandHasDecimal =
    checkDecimal(operand) || fractionPart !== '';
  // don't add decimal to max length integers
  const decimal =
    operandHasDecimal && integerPart.length < MAX_INPUT_LENGTH ? '.' : '';

  const fraction =
    fractionPart === undefined
      ? ''
      : fractionPart.slice(0, MAX_INPUT_LENGTH - integerPart.length);

  const integer = addCommas(integerPart);

  return [false, prefix + integer + decimal + fraction];
}

export function calculateDisplaySize(operand: string) {
  const digits = countDigits(operand);
  if (digits <= 6) return 50;
  return 50 - 4 * (digits - 6);
}

export function evaluate(
  operand1: string,
  operator: string,
  operand2: string
): [boolean, string] {
  const number1 = Number(filterCommas(operand1));
  const number2 = Number(filterCommas(operand2));
  let result;

  if (operator === '/') {
    result = number1 / number2;
  } else if (operator === '*') {
    result = number1 * number2;
  } else if (operator === '-') {
    result = number1 - number2;
  } else if (operator === '+') {
    result = number1 + number2;
  }

  if (
    result === undefined ||
    isNaN(result) ||
    result === Infinity ||
    result === -Infinity
  ) {
    return [true, '0'];
  }

  return formatOperand(result.toString());
}
