import { useReducer, useState, useEffect } from "react";
import DigitButton from "./components/DigitButton";
import OperationDigitButton from "./components/OperationButton";
import ThemeToggle from "./components/ThemeToggle";
import "./style.css";

// Define actions for the calculator
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"
};

// Reducer function to handle state changes based on actions
function reducer(state, { type, payload }) {
  switch (type) {
    // Add a digit to the current operand
    case ACTIONS.ADD_DIGIT:
      // If overwrite is true, clear the current operand and set overwrite to false
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        };
      }
      // Avoid leading zeroes
      if (payload.digit === "0" && state.currentOperand === "0") return state;

      // Avoid multiple decimal points
      if (
        payload.digit === "." &&
        (!state.currentOperand || state.currentOperand.includes("."))
      )
        return state;
      // Add the digit to the current operand
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      };

    // Choose an operation
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        };
      }

      // Evaluate the expression and update the state
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      };

    // Clear the calculator
    case ACTIONS.CLEAR:
      return {};

    // Delete a digit from the current operand
    case ACTIONS.DELETE_DIGIT:
      // If overwrite is true, clear the current operand and set overwrite to false
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        };
      }
      // Avoid deleting when there's no current operand
      if (state.currentOperand == null) return state;

      // Delete the last digit from the current operand
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      };

    // Evaluate the expression
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      // Update the state with the result of the evaluation
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      };
  }
}

// Function to evaluate the expression
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

// Number formatter for integers
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
});

// Function to format the operand
// 小數部分為null則用INTEGER_FORMATTER格式化整數
// 非null則用.分割整數和小數
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

// Use the reducer to manage the calculator's state
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  // State for the dark theme
  const [isDark, setIsDark] = useState(false);

  // Handle keyboard interactions
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key >= "0" && event.key <= "9") {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: event.key } });
      }
      if (event.key === ".") {
        dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: event.key } });
      }
      if (event.key === "=" || event.key === "Enter") {
        dispatch({ type: ACTIONS.EVALUATE });
      }
      if (event.key === "Backspace" || event.key === "Delete") {
        dispatch({ type: ACTIONS.DELETE_DIGIT });
      }
      if (event.key === "Escape") {
        dispatch({ type: ACTIONS.CLEAR });
      }
      if (
        event.key === "+" ||
        event.key === "-" ||
        event.key === "*" ||
        event.key === "/"
      ) {
        const operationMap = {
          "+": "+",
          "-": "-",
          "*": "*",
          "/": "÷"
        };
        dispatch({
          type: ACTIONS.CHOOSE_OPERATION,
          payload: { operation: operationMap[event.key] }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div className="App" data-theme={isDark ? "dark" : "light"}>
      <ThemeToggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
      <div className="calculator-grid">
        {/* Output display */}
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        {/* Clear button */}
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        {/* Delete button */}
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        {/* Operation buttons */}
        <OperationDigitButton operation="÷" dispatch={dispatch} />
        {/* Digit buttons */}
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationDigitButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationDigitButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationDigitButton operation="-" dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />

        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
