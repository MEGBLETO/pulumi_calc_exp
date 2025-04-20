"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const app = (0, express_1.default)();
app.post("/calculate", (req, res) => {
    let body;
    try {
        const raw = req.body;
        const parsed = JSON.parse(raw.toString());
        console.log("Parsed body:", parsed);
        body = parsed;
    }
    catch (err) {
        console.error("Failed to parse body", err);
        return res.status(400).json({ error: "Invalid JSON body" });
    }
    const { a, b, op } = body;
    if (typeof a !== "number" || typeof b !== "number") {
        return res.status(400).json({ error: "Operands must be numbers" });
    }
    let result;
    try {
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
                    return res.status(400).json({ error: "Division by zero" });
                }
                result = a / b;
                break;
            default:
                return res.status(400).json({ error: "Invalid operator" });
        }
    }
    catch (error) {
        console.error("Calculation error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
    return res.json({ result });
});
exports.handler = (0, serverless_http_1.default)(app);
