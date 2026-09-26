export type PercentageMode = "percent_of" | "what_percent" | "increase_decrease";

export interface PercentageInput {
  mode: PercentageMode;
  valueX: number;
  valueY: number;
}

export interface PercentageResult {
  mode: PercentageMode;
  result: number;
  explanation: string;
  isIncrease?: boolean;
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const x = isNaN(input.valueX) ? 0 : input.valueX;
  const y = isNaN(input.valueY) ? 0 : input.valueY;

  switch (input.mode) {
    case "percent_of": {
      // What is X% of Y? (X / 100) * Y
      const res = (x / 100) * y;
      return {
        mode: "percent_of",
        result: Number(res.toFixed(4)),
        explanation: `${x}% of ${y} is ${Number(res.toFixed(2))}`,
      };
    }

    case "what_percent": {
      // X is what % of Y? (X / Y) * 100
      if (y === 0) {
        return {
          mode: "what_percent",
          result: 0,
          explanation: "Division by zero is undefined. Value Y cannot be 0.",
        };
      }
      const res = (x / y) * 100;
      return {
        mode: "what_percent",
        result: Number(res.toFixed(2)),
        explanation: `${x} is ${Number(res.toFixed(2))}% of ${y}`,
      };
    }

    case "increase_decrease": {
      // Percentage change from X to Y: ((Y - X) / |X|) * 100
      if (x === 0) {
        return {
          mode: "increase_decrease",
          result: 0,
          explanation: "Initial value X cannot be 0 to calculate percentage change.",
        };
      }
      const diff = y - x;
      const res = (diff / Math.abs(x)) * 100;
      const isIncrease = diff >= 0;
      return {
        mode: "increase_decrease",
        result: Number(Math.abs(res).toFixed(2)),
        isIncrease,
        explanation: `${isIncrease ? "Increase" : "Decrease"} of ${Number(Math.abs(res).toFixed(2))}% from ${x} to ${y}`,
      };
    }
  }
}
