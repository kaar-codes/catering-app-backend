import { Router } from "express";
import errorHandler from "../controllers/errorHandler.js";

const authRouter = Router();

authRouter.post("/login", errorHandler.catchAsync(req,res) {

});

authRouter.post("/register", async (req, res) => {
  try {
  } catch (error) {}
});

authRouter.post("/forgotPassword", async (req, res) => {
  try {
  } catch (error) {}
});

export default authRouter;
