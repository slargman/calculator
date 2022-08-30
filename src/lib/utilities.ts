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

export function formatOperand(operand: string) {
  operand = filterCommas(operand);
  const number = Number(operand);

  if (
    Math.abs(number) >= 10 ** MAX_INPUT_LENGTH ||
    (Math.abs(number) <= 10 ** -(MAX_INPUT_LENGTH - 1) && number !== 0)
  ) {
    return 'Error';
  }

  const operandIsNegative = checkNegative(operand);

  const prefix = operandIsNegative ? '-' : '';

  const operandParts = operand.split(/\D/);
  const integerPart = operandIsNegative ? operandParts[1] : operandParts[0];
  const fractionPart = operandIsNegative ? operandParts[2] : operandParts[1];

  const operandHasDecimal = checkDecimal(operand);
  // don't add decimal to max length integers
  const decimal =
    operandHasDecimal && integerPart.length < MAX_INPUT_LENGTH ? '.' : '';

  const fraction =
    fractionPart === undefined
      ? ''
      : fractionPart.slice(0, MAX_INPUT_LENGTH - integerPart.length);

  let integer = trimLeadingZeros(integerPart);
  integer = addCommas(integer);

  return prefix + integer + decimal + fraction;
}

export function calculateDisplaySize(operand: string) {
  const digits = countDigits(operand);
  if (digits <= 6) return 50;
  return 50 - 4 * (digits - 6);
}

export function evaluate(operand1: string, operator: string, operand2: string) {
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
    return 'Error';
  }

  return formatOperand(result.toString());
}
