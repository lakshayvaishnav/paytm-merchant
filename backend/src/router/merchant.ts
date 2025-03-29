import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_MERCHANT_PASS } from "../config";

const prismaclient = new PrismaClient();

export const merchantRouter = Router();

merchantRouter.post("/signup", async (req, res) => {
  const { username, password, name } = req.body; // zod to verify schema

  try {
    await prismaclient.$transaction(async (tx) => {
      const merchant = await tx.merchant.create({
        data: {
          username,
          password,
          name,
        },
      });
      await tx.merchantAccount.create({
        data: {
          merchantId: merchant.id,
        },
      });
    });
    res.json({ message: "Signed up" });
  } catch (error) {
    res.json({ message: "error occured" });
    console.log(error);
  }
});

// @ts-ignore
merchantRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const merchant = await prismaclient.merchant.findFirst({
      where: {
        username,
        password,
      },
    });
    if (!merchant) {
      return res.status(203).json({ message: "unable to log you in" });
    }

    const token = jwt.sign({ id: merchant.id }, JWT_MERCHANT_PASS);
    res.json({ token });
  } catch (error) {
    console.log("error");
    res.status(500).json({ message: "error occured" });
  }
});
