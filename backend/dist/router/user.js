"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const prismaclient = new client_1.PrismaClient();
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, name } = req.body; // zod to verify schema
    try {
        yield prismaclient.user.create({
            data: {
                username,
                password,
                name,
            },
        });
        res.json({ message: "Signed up" });
    }
    catch (error) {
        res.json({ message: "error occured" });
        console.log(error);
    }
}));
// @ts-ignore
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prismaclient.user.findFirst({
            where: {
                username,
                password,
            },
        });
        if (!user) {
            return res.status(203).json({ message: "unable to log you in" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_USER_PASS);
        res.json({ token });
    }
    catch (error) {
        console.log("error");
        res.status(500).json({ message: "error occured" });
    }
}));
