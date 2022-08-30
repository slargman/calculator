import { useReducer } from 'react';
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

type State = {
  mem: null | string;
  operand: string;
  operator: null | string;
};

type Action =
  | { type: 'cleared_all' }
  | { type: 'cleared_operand' }
  | { type: 'appended_digit'; digit: string }
  | { type: 'appended_decimal' }
  | { type: 'applied_plus_minus' }
  | { type: 'applied_percent' }
  | { type: 'selected_operator'; operator: string }
  | { type: 'evaluated_with_operator'; operator: string }
  | { type: 'evaluated_with_equals' }
  | { type: 'input_new_number'; digit: string };

const initialState = {
  mem: null,
  operand: '0',
  operator: null,
};

function reducer(state: State, action: Action) {
  const { mem, operand, operator } = state;
  switch (action.type) {
    case 'cleared_all': {
      return initialState;
    }
    case 'cleared_operand': {
      return { ...state, operand: '0' };
    }
    case 'appended_digit': {
      return {
        ...state,
        operand: formatOperand(operand + action.digit),
      };
    }
    case 'appended_decimal': {
      return {
        ...state,
        operand: formatOperand(operand + '.'),
      };
    }
    case 'applied_plus_minus': {
      return {
        ...state,
        operand: formatOperand(
          checkNegative(operand) ? operand.substring(1) : '-' + operand
        ),
      };
    }
    case 'applied_percent': {
      return {
        ...state,
        operand: formatOperand(evaluate(operand, '/', '100')),
      };
    }
    case 'selected_operator': {
      return {
        ...state,
        operator: action.operator,
      };
    }
    case 'evaluated_with_operator': {
      return {
        mem: evaluate(mem, operator, operand),
        operator: action.operator,
        operand: '0',
      };
    }
    case 'evaluated_with_equals': {
      return {
        mem: null,
        operator: null,
        operand: evaluate(mem, operator, operand),
      };
    }
    case 'input_new_number': {
      return {
        mem: null,
        operator: null,
        operand: formatOperand(action.digit),
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function App() {
  const [{ mem, operand, operator }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const handleClearClick = () => {
    if (operand === '0') {
      dispatch({ type: 'cleared_all' });
    } else {
      dispatch({ type: 'cleared_operand' });
    }
  };
  const handlePlusMinusClick = () => {};
  const handlePercentClick = () => {};
  const handleOperatorClick = (op: string) => {};
  const handleEqualsClick = () => {};
  const handleDecimalClick = () => {};
  const handleDigitClick = (digit: string) => {};

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
          {operand === '0' ? 'AC' : 'C'}
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
              handleDigitClick(`${i}`);
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
