import express, { Request, Response } from "express";
import serverless from "serverless-http";
import { Calculator } from "./services/Calculator";

const app = express();

interface CalcRequestBody {
  a: number;
  b: number;
  op: "+" | "-" | "*" | "/";
}

app.post("/calculate", async (req: any, res: any) => {
  let body: CalcRequestBody;

  try {
    if (Buffer.isBuffer(req.body)) {
      const parsed = JSON.parse(req.body.toString());
      console.log("Parsed body from buffer:", parsed);
      body = parsed;
    } else if (typeof req.body === "string") {
      const parsed = JSON.parse(req.body);
      console.log("Parsed body from string:", parsed);
      body = parsed;
    } else {
      body = req.body;
    }
  } catch (error) {
    console.error("Body parse error:", error);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { a, b, op } = body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "Operands must be numbers" });
  }

  try {
    const result = await Calculator.calculate(a, b, op);
    return res.json({ result });
  } catch (error: any) {
    console.error("Calculation error:", error);
    return res.status(400).json({ error: error.message || "Invalid operation" });
  }
});

export const handler = serverless(app);
