import { Router } from "express";
import QuoteModel from "../models/quoteModel.js";

const quoteRouter = Router();

quoteRouter.post("/addQuote", async function (req, res) {
  try {
    await QuoteModel.create(req.body);
    res.status(201).json({ message: "User have made a Quote" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default quoteRouter;
