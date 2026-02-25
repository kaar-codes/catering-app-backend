import { Router } from "express";
import UserModel from "../models/userModel.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentUser = await UserModel.findOne({ email });
    if (await compare(password, currentUser.password)) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.status(201).json({ message: "User Logged in", token });
    } else {
      throw new Error("Bad Authentication");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

export default authRouter;
