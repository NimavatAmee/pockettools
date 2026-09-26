/**
 * Safe expression evaluator without eval()
 * Supports +, -, *, /, %, parenthesis, decimals, negative numbers
 */

export interface EvaluationResult {
  success: boolean;
  value?: number;
  error?: string;
}

export function evaluateExpression(expr: string): EvaluationResult {
  if (!expr || !expr.trim()) {
    return { success: true, value: 0 };
  }

  // Sanitize and normalize operators
  const cleanExpr = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\s+/g, "");

  // Tokenize
  const tokens: string[] = [];
  let currentNum = "";

  for (let i = 0; i < cleanExpr.length; i++) {
    const char = cleanExpr[i];

    if ((char >= "0" && char <= "9") || char === ".") {
      currentNum += char;
    } else if (["+", "-", "*", "/", "%", "(", ")"].includes(char)) {
      if (currentNum !== "") {
        tokens.push(currentNum);
        currentNum = "";
      }

      // Handle unary minus (e.g. at start or after an operator/left paren)
      if (
        char === "-" &&
        (tokens.length === 0 ||
          ["+", "-", "*", "/", "(", "%"].includes(tokens[tokens.length - 1]))
      ) {
        currentNum = "-";
      } else {
        tokens.push(char);
      }
    } else {
      return { success: false, error: `Invalid character: ${char}` };
    }
  }

  if (currentNum !== "") {
    if (currentNum === "-") return { success: false, error: "Incomplete expression" };
    tokens.push(currentNum);
  }

  // Shunting-yard algorithm to convert infix to postfix (RPN)
  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  const precedence: Record<string, number> = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
  };

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      outputQueue.push(token);
    } else if (token in precedence) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        return { success: false, error: "Mismatched parentheses" };
      }
      operatorStack.pop(); // Pop "("
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;
    if (op === "(" || op === ")") {
      return { success: false, error: "Mismatched parentheses" };
    }
    outputQueue.push(op);
  }

  // Evaluate RPN
  const evalStack: number[] = [];

  for (const token of outputQueue) {
    if (!isNaN(Number(token))) {
      evalStack.push(Number(token));
    } else {
      if (evalStack.length < 2) {
        return { success: false, error: "Invalid syntax" };
      }
      const b = evalStack.pop()!;
      const a = evalStack.pop()!;

      switch (token) {
        case "+":
          evalStack.push(a + b);
          break;
        case "-":
          evalStack.push(a - b);
          break;
        case "*":
          evalStack.push(a * b);
          break;
        case "/":
          if (b === 0) {
            return { success: false, error: "Cannot divide by zero" };
          }
          evalStack.push(a / b);
          break;
        case "%":
          evalStack.push((a * b) / 100);
          break;
        default:
          return { success: false, error: `Unknown operator ${token}` };
      }
    }
  }

  if (evalStack.length !== 1) {
    return { success: false, error: "Invalid calculation" };
  }

  const rawVal = evalStack[0];
  if (isNaN(rawVal) || !isFinite(rawVal)) {
    return { success: false, error: "Calculation overflow" };
  }

  // Round to avoid floating-point inaccuracies like 0.1 + 0.2 = 0.30000000000000004
  const rounded = Number(Math.round(Number(rawVal + "e+10")) + "e-10");
  return { success: true, value: rounded };
}
