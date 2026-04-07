import QuoteModel from "../models/quoteModel.js";
import { sendMailForUserWithUpdates } from "./mailController.js";

/**
 * Create an Quote
 * @param {*} req
 * @param {*} res
 */
export async function createQuote(req, res) {
  try {
    const quote = await QuoteModel.create(req.body);
    await sendMailForUserWithUpdates(quote);
    res.status(200).json({ status: "success", message: `Quote Creation` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Update the Quote Status to a specific value such as Cancel, Waiting List, Confirm and Cancel.
 * @param {*} req
 * @param {*} res
 */
export async function updateQuote(req, res) {
  try {
    const quoteIdNeedToUpdate = req.body.quoteId;
    const quote = await QuoteModel.findOneAndUpdate(
      {
        _id: quoteIdNeedToUpdate,
        $and: [
          { status: { $ne: "Cancel" } },
          { status: { $ne: req.body.status } },
        ],
      },
      req.body,
      {
        runValidators: true,
        returnDocument: "after",
      },
    );
    if (quote) {
      await sendMailForUserWithUpdates(quote);
      res
        .status(200)
        .json({ status: "success", message: "Quote Status Update" });
    } else {
      throw new Error("Quote Not found or had been Cancelled");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * All the quotes from the DB can be requested by an Admin User
 * @param {*} req
 * @param {*} res
 */
export async function getAllQuotes(req, res) {
  try {
    const data = await QuoteModel.find();
    res.json({ message: "Quotes", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
