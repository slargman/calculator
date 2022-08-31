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
  error: boolean;
};

const initialState = {
  mem: null,
  operand: '0',
  operator: null,
  error: false,
};

type Action =
  | { type: 'cleared_all' }
  | { type: 'cleared_operand' }
  | { type: 'appended_digit'; digit: string }
  | { type: 'input_new_number'; digit: string }
  | { type: 'appended_decimal' }
  | { type: 'applied_plus_minus' }
  | { type: 'applied_percent' }
  | { type: 'selected_operator'; operator: string }
  | { type: 'evaluated_with_operator'; operator: string }
  | { type: 'evaluated_with_equals' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'cleared_all': {
      return initialState;
    }
    case 'cleared_operand': {
      return { ...state, operand: '0', error: false };
    }
    case 'appended_digit': {
      const [error, operand] = formatOperand(state.operand + action.digit);
      return {
        ...state,
        operand,
        error,
      };
    }
    case 'input_new_number': {
      const [error, operand] = formatOperand(action.digit);
      return {
        ...state,
        mem: state.operand,
        operand,
        error,
      };
    }
    case 'appended_decimal': {
      const [error, operand] = formatOperand(state.operand + '.');
      return {
        ...state,
        operand,
        error,
      };
    }
    case 'applied_plus_minus': {
      const [error, operand] = formatOperand(
        checkNegative(state.operand)
          ? state.operand.substring(1)
          : '-' + state.operand
      );
      return {
        ...state,
        operand,
        error,
      };
    }
    case 'applied_percent': {
      const [error, operand] = evaluate(state.operand, '/', '100');
      return {
        ...state,
        operand,
        error,
      };
    }
    case 'selected_operator': {
      return {
        ...state,
        operator: action.operator,
      };
    }
    case 'evaluated_with_operator': {
      if (state.mem === null || state.operator === null) return state;
      const [error, operand] = evaluate(
        state.mem,
        state.operator,
        state.operand
      );
      if (error) {
        return { ...initialState, error: true };
      } else {
        return {
          mem: null,
          operator: action.operator,
          operand,
          error,
        };
      }
    }
    case 'evaluated_with_equals': {
      if (state.mem === null || state.operator === null) return state;
      const [error, operand] = evaluate(
        state.mem,
        state.operator,
        state.operand
      );
      return {
        mem: null,
        operator: null,
        operand,
        error,
      };
    }
  }
  /*
  throw Error('Unknown action: ' + action.type);
  */
}

export default function App() {
  const [{ mem, operand, operator, error }, dispatch] = useReducer(
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
  const handlePlusMinusClick = () => {
    if (error) {
      dispatch({ type: 'cleared_all' });
      return;
    }

    dispatch({ type: 'applied_plus_minus' });
  };
  const handlePercentClick = () => {
    if (error) {
      dispatch({ type: 'cleared_all' });
      return;
    }

    dispatch({ type: 'applied_percent' });
  };
  const handleOperatorClick = (op: string) => {
    if (error) {
      dispatch({ type: 'cleared_all' });
      return;
    }

    if (operator === null) {
      dispatch({ type: 'selected_operator', operator: op });
    } else {
      dispatch({ type: 'evaluated_with_operator', operator: op });
    }
  };
  const handleEqualsClick = () => {
    if (error) {
      dispatch({ type: 'cleared_all' });
      return;
    }

    if (mem === null || operator === null) return;
    dispatch({ type: 'evaluated_with_equals' });
  };
  const handleDecimalClick = () => {
    if (checkDecimal(operand)) return;
    dispatch({ type: 'appended_decimal' });
  };
  const handleDigitClick = (digit: string) => {
    if (countDigits(operand) === MAX_INPUT_LENGTH) return;
    if (operator !== null && mem === null) {
      dispatch({ type: 'input_new_number', digit });
    } else {
      dispatch({ type: 'appended_digit', digit });
    }
  };

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
          {error ? 'Error' : operand}
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
              (op === operator && mem === null ? 'OperatorActive' : '')
            }
            onClick={
              op === '='
                ? () => {
                    handleEqualsClick();
                  }
                : () => {
                    handleOperatorClick(op);
                  }
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
