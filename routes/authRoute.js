import { Router } from "express";
import {
  changepassword,
  forgotPassword,
  loginUser,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/changepassword", changepassword);

export default authRouter;
