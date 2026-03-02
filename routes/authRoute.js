import { Router } from "express";
import UserModel from "../models/userModel.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMailWithOTP } from "../controllers/mailController.js";

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

authRouter.post("/fpassword", async (req, res) => {
  try {
    // 1. Verify User exist in DB
    const { email, firstName } = await UserModel.findOne(
      { email: req.body.email },
      { email: true, firstName: true },
    );

    res.status(200).json({
      message: "User Forgot Password Request",
      userDet: { email, firstName },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

authRouter.post("/changepassword", async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;
    const hashedPassword = await hash(password, 8);
    // const originalOtp = await sendMailWithOTP();
    const originalOtp = "8mkws7nZ";
    if (otp === originalOtp && password === confirmPassword) {
      console.log(password);
      await UserModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { runValidators: true },
      );
    } else {
      throw new Error("OTP or PASSWORD didn't match each other");
    }
    res.status(200).json({ message: "User Password Updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default authRouter;
