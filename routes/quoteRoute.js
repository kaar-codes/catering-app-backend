import { Router } from "express";
import QuoteModel from "../models/quoteModel.js";
import { isAdminUser } from "../controllers/authController.js";

const quoteRouter = Router();

quoteRouter.post("/addQuote", async function (req, res) {
  try {
    await QuoteModel.create(req.body);
    res.status(201).json({ message: "User have made a Quote" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

quoteRouter.get("/quotes", isAdminUser, async (req, res) => {
  try {
    const data = await QuoteModel.find();
    res.json({ message: "Quotes", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

quoteRouter.patch("/editQuote/:id", isAdminUser, async (req, res) => {
  try {
    // Quote Status with Cancelled Status Cannot be able to update

    const data = await QuoteModel.findOneAndUpdate(
      { _id: req.params.id, status: { $not: /cancel/i } },
      req.body,
      { runValidators: true },
    );

    // Throw Email to the Customer when any of the Status been changed

    if (!data) {
      res.status(404).json({ message: "Quote Not Found to be Active" });
    } else {
      res.status(200).json({ message: "Quote Updated", data });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default quoteRouter;
