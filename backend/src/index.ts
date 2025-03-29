import express from "express";
import { userRouter } from "./router/user";
import { merchantRouter } from "./router/merchant";

const app = express();
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/merchant", merchantRouter);

app.listen(8080, () => {
  console.log("server running on port 8080");
});
