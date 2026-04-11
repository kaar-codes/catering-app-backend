import { Schema, model } from "mongoose";
import UserModel from "./userModel.js";
import MenuModel from "./menuModel.js";

const gapBasedEvent = new Map([
  ["birthday", 10],
  ["marriage", 100],
  ["engagements", 90],
  ["corporate events", 7],
  ["house warming", 5],
  ["baby shower", 7],
  ["temple festival", 2],
  ["other", 2],
]);

const quotesMenu = new Schema({
  menuType: {
    type: String,
    enum: [
      "breakfast",
      "lunch",
      "dinner",
      "snacks and sweets",
      "stalls and extras",
      "drinks and beverages",
      "starters and sidedishes",
    ],
    required: [true, "Menu Type is mandatory"],
  },
  menuName: {
    type: String,
    required: [true, "Menu Items is mandatory"],
    validate: [
      async function (val) {
        console.log(val);
        const menu = await MenuModel.findOne({ menuname: val });
        return menu.mid != undefined;
      },
      "Menu Name not Found",
    ],
  },
});

const quoteSchema = new Schema({
  _id: {
    type: String,
    alias: "quoId",
  },
  eventTitle: String,
  eventDescription: String,
  eventType: {
    type: String,
    enum: Array.from(gapBasedEvent.keys()),
    required: [true, "Event Type is mandatory"],
  },
  eventDate: {
    type: Date,
    required: [true, "Event Date is mandatory"],
    validate: [
      function (val) {
        const currentDate = new Date();
        const exactGap = Math.trunc((val - currentDate) / 86400000);
        return exactGap >= gapBasedEvent.get(this.eventType);
      },
      "Event date is invalid",
    ],
  },
  place: {
    type: String,
  },
  guestRange: {
    type: String,
    enum: ["100 - 250", "250 - 500", "500 - 1000", "Other"],
    required: [true, "Guest range is mandatory"],
  },
  email: {
    type: String,
    validate: [
      async function isValidEmail(val) {
        const allUserEmailIds = await UserModel.find().select({
          _id: false,
          email: true,
        });
        const arrOfUserEmail = allUserEmailIds.map((val) => val.email);
        return arrOfUserEmail.includes(val);
      },
      "Customer email is Invalid",
    ],
  },
  phone: {
    type: String,
    validate: [
      async function (value) {
        const user = await UserModel.findOne({ phone: value });
        return user != null; // Returns true if user exists
      },
      "Customer Contact is Invalid",
    ],
  },
  status: {
    type: String,
    enum: ["In Enquiry", "Waiting List", "Cancel", "Confirm"],
    default: "In Enquiry",
  },
  menu: {
    type: [quotesMenu],
    required: [true, "Menu Items are required"],
    validate: [
      async function (val) {
        return val.length >= 1;
      },
      "Minimum 1 Item is needed",
    ],
  },
});

quoteSchema.pre("save", async function () {
  const countDoc = (await this.constructor.countDocuments({})) + 1;
  this._id = "QUO-SPR-" + countDoc;
});

const QuoteModel = model("Quote", quoteSchema);

export default QuoteModel;
