import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import { compare, hash } from "bcrypt";
import {
  sendMailWithOTP,
  verifySecret,
} from "../controllers/mailController.js";

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
    const { uniqueQuery, password: plainPassword } = req.body;
    const user = await UserModel.findOne({
      $or: [{ email: uniqueQuery }, { phone: uniqueQuery }],
    });
    // If the hashedPassword and plainPassword (User Password)
    if (!(await compare(plainPassword, user.password))) {
      throw new Error("Bad Authentication");
    }

    // Deleting the Password from the User Document before sending the response
    const userObj = user.toObject();
    delete userObj["password"];

    // Access token
    const accessToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    // Send Reponse
    res
      .status(200)
      .json({ message: "User Authenticated", userObj, accessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { uniqueQuery } = req.body;
    const { _doc } = await UserModel.findOne({
      $or: [{ email: uniqueQuery }, { phone: uniqueQuery }],
    });
    const { messageUrl } = await sendMailWithOTP(_doc.email);
    res
      .status(200)
      .json({ message: "Email has been sent to the User", url: messageUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function changepassword(req, res) {
  try {
    const { email, newPassword, secret } = req.body;
    if (await verifySecret({ secret })) {
      await UserModel.findOneAndUpdate(
        {
          email,
        },
        { password: await hash(newPassword, 8) },
      );
      res
        .status(200)
        .json({ message: "Password has been successfully created" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
