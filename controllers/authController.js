import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ").at(-1);
    const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (isVerified) {
      next();
    } else {
      throw new Error("Authorization token has expired");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, phone, password: plainPassword } = req.body;
    const { _id: userId, password: hashPassword } = await User.findOne({
      $or: [{ email, phone }],
    });
    await compare(plainPassword, hashPassword);

    const accessToken = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET_KEY,
      { algorithm: "HS256", expiresIn: process.env.JWT_EXPIRES_IN },
    );
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET_KEY,
      { algorithm: "HS256", expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    });

    res.status(200).json({
      message: "User Authenticated",
      token: accessToken,
    });
  } catch (error) {
    res.status(400).json({ message: "Bad Authentication" });
  }
}
