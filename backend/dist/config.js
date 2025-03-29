"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_MERCHANT_PASS = exports.JWT_USER_PASS = void 0;
const JWT_PASS = process.env.JWT_PASS || "123123";
exports.JWT_USER_PASS = JWT_PASS + "user";
exports.JWT_MERCHANT_PASS = JWT_PASS + "merchant";
