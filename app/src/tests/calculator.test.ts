import { Calculator } from "../services/Calculator";

describe("Calculator", () => {
  it("should add two numbers", async () => {
    const result = await Calculator.calculate(5, 3, "+");
    expect(result).toBe(8);
  });

  it("should subtract two numbers", async () => {
    const result = await Calculator.calculate(10, 4, "-");
    expect(result).toBe(6);
  });

  it("should multiply two numbers", async () => {
    const result = await Calculator.calculate(6, 7, "*");
    expect(result).toBe(42);
  });

  it("should divide two numbers", async () => {
    const result = await Calculator.calculate(20, 5, "/");
    expect(result).toBe(4);
  });

  it("should throw an error for division by zero", async () => {
    await expect(Calculator.calculate(10, 0, "/")).rejects.toThrow(
      "Division by zero"
    );
  });

  it("should throw an error for invalid operator", async () => {
    // @ts-expect-error to test bad input
    await expect(Calculator.calculate(10, 5, "%")).rejects.toThrow(
      "Invalid operator"
    );
  });
});
