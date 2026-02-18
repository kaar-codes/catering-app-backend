import { Router } from "express";
import UserModel from "../models/userModel.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  await UserModel.create(req.body);
  res.status(201).json({ message: "User Created" });
});

export default userRouter;
