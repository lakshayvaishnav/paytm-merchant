"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./router/user");
const merchant_1 = require("./router/merchant");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/merchant", merchant_1.merchantRouter);
app.listen(8080, () => {
    console.log("server running on port 8080");
});
