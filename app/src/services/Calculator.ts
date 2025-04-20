export class Calculator {
  static async calculate(a: number, b: number, op: "+" | "-" | "*" | "/"): Promise<number> {
    let result: number;

    switch (op) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "*":
        result = a * b;
        break;
      case "/":
        if (b === 0) {
          throw new Error("Division by zero");
        }
        result = a / b;
        break;
      default:
        throw new Error("Invalid operator");
    }

    return result;
  }
}