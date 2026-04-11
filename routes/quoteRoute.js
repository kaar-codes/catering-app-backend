import { Router } from "express";
import { isAdminUser } from "../controllers/authController.js";
import {
  createQuote,
  getAllQuotes,
  updateQuote,
} from "../controllers/quoteController.js";

const quoteRouter = Router();
quoteRouter.post("/addQuote", createQuote);
quoteRouter.get("/quotes", isAdminUser, getAllQuotes);
quoteRouter.patch("/editQuote", isAdminUser, updateQuote);

export default quoteRouter;
