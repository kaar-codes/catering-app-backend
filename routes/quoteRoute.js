import { Router } from "express";
import { authenticateUser } from "../controllers/authController.js";
import { isAdminUser } from "../controllers/authController.js";
import {
  createQuote,
  getAllQuotes,
  updateQuote,
  userSpecificQuotes,
} from "../controllers/quoteController.js";

const quoteRouter = Router();
quoteRouter.post("/addQuote", createQuote);
quoteRouter.get("/quotes", isAdminUser, getAllQuotes);
quoteRouter.patch("/editQuote", isAdminUser, updateQuote);
quoteRouter.get("/allYourQuote", authenticateUser, userSpecificQuotes);

export default quoteRouter;
