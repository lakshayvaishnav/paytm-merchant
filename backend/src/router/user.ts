import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_USER_PASS } from "../config";

const prismaclient = new PrismaClient();

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { username, password, name } = req.body; // zod to verify schema

  try {
    await prismaclient.user.create({
      data: {
        username,
        password,
        name,
      },
    });
    res.json({ message: "Signed up" });
  } catch (error) {
    res.json({ message: "error occured" });
    console.log(error);
  }
});

// @ts-ignore
userRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prismaclient.user.findFirst({
      where: {
        username,
        password,
      },
    });
    if (!user) {
      return res.status(203).json({ message: "unable to log you in" });
    }

    const token = jwt.sign({ id: user.id }, JWT_USER_PASS);
    res.json({ token });
  } catch (error) {
    console.log("error");
    res.status(500).json({ message: "error occured" });
  }
});
