import { Router } from "express";
import UserModel from "../models/userModel.js";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    await UserModel.create(req.body);
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default userRouter;
