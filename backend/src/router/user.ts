import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT_USER_PASS } from "../config";
import { userAuthMiddleware } from "../middleware";

const prismaclient = new PrismaClient();

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { username, password, name } = req.body; // zod to verify schema

  try {
    prismaclient.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password,
          name,
        },
      });

      await tx.userAccount.create({
        data: {
          userId: user.id,
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

// @ts-ignore
userRouter.post("/onramp", async (req, res) => {
  const { userId, amount } = req.body;

  await prismaclient.userAccount.update({
    where: {
      userId: userId,
    },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
  return res.json({
    message: "on ramp done",
  });
});

// @ts-ignore
userRouter.post("/transfer", userAuthMiddleware, async (req, res) => {
  const { merchantId, amount } = req.body;
  // @ts-ignore
  const userId = req.id;
  // very safe
  // Lock the user balance row (double spending problem)
  const paymentDone = prismaclient.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "UserAccount" WHERE "userId" = ${userId} FOR UPDATE`;

    const userAccount = await tx.userAccount.findFirst({
      where: {
        userId,
      },
    });

    if (userAccount?.balance || 0 < amount) {
      return false;
    }

    await tx.merchantAccount.update({
      where: {
        merchantId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
    console.log("transaction done");
    return true;
  });

  // @ts-ignore
  if (paymentDone) {
    return res.json({
      message: "payment done",
    });
  } else {
    return res.status(411).json({
      message: "payment not done",
    });
  }
});
