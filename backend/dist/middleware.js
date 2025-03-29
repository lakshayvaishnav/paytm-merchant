"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.merchantAuthMiddleware = exports.userAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userAuthMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    const verified = jsonwebtoken_1.default.verify(token, config_1.JWT_USER_PASS);
    if (verified) {
        //   @ts-ignore
        req.id = verified.id;
        next();
    }
    else {
        return res.status(403).json({
            message: "Not authorized",
        });
    }
};
exports.userAuthMiddleware = userAuthMiddleware;
const merchantAuthMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    const verified = jsonwebtoken_1.default.verify(token, config_1.JWT_MERCHANT_PASS);
    if (verified) {
        //   @ts-ignore
        req.id = verified.id;
        next();
    }
    else {
        return res.status(403).json({
            message: "Not authorized",
        });
    }
};
exports.merchantAuthMiddleware = merchantAuthMiddleware;
