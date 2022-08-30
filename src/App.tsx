import { useState } from 'react';
import {
  MAX_INPUT_LENGTH,
  countDigits,
  checkDecimal,
  checkNegative,
  formatOperand,
  calculateDisplaySize,
  evaluate,
} from './lib/utilities';
import './App.css';

export default function App() {
  const [mem, setMem] = useState<null | string>(null);
  const [operand, setOperand] = useState<string>('0');
  const [operator, setOperator] = useState<null | string>(null);

  const handleClearClick = () => {};
  const handlePlusMinusClick = () => {};
  const handlePercentClick = () => {};
  const handleOperatorClick = (op: string) => {};
  const handleEqualsClick = () => {};
  const handleDecimalClick = () => {};
  const handleNumberClick = (number: string) => {};

  const operators = [
    { op: '/', gridArea: 'division', display: '÷' },
    { op: '*', gridArea: 'multiplication', display: '×' },
    { op: '-', gridArea: 'subtraction', display: '-' },
    { op: '+', gridArea: 'addition', display: '+' },
    { op: '=', gridArea: 'equals', display: '=' },
  ];

  return (
    <div className="App">
      <div className="Calculator">
        <div
          style={{
            gridArea: `display`,
            fontSize: calculateDisplaySize(operand),
          }}
          className="Display"
        >
          {operand}
        </div>
        <button
          style={{ gridArea: `ac` }}
          className="Button Function"
          onClick={handleClearClick}
        >
          {operand === '' ? 'AC' : 'C'}
        </button>
        <button
          onClick={handlePlusMinusClick}
          style={{ gridArea: `plus-minus` }}
          className="Button Function"
        >
          +/-
        </button>
        <button
          onClick={handlePercentClick}
          style={{ gridArea: `percent` }}
          className="Button Function"
        >
          %
        </button>
        {operators.map(({ op, gridArea, display }) => (
          <button
            key={op}
            style={{ gridArea }}
            className={
              'Button Operator ' +
              (op === operator && mem !== null ? 'OperatorActive' : '')
            }
            onClick={
              op === '='
                ? () => handleEqualsClick
                : () => handleOperatorClick(op)
            }
          >
            {display}
          </button>
        ))}
        <button
          onClick={handleDecimalClick}
          style={{ gridArea: `decimal` }}
          className="Button"
        >
          .
        </button>
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i}
            data-number={i.toString()}
            onClick={() => {
              handleNumberClick(`${i}`);
            }}
            style={{ gridArea: `number-${i}` }}
            className={'Button ' + (i === 0 ? 'Button-0' : '')}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
