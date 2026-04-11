import { Schema, model } from "mongoose";

const menuSchema = new Schema({
  // mid: {
  //   type: String,
  //   required: [true, "Menu ID is a mandatory field"],
  //   unique: [true, "Menu ID need to be unique"],
  //   upperCase: [true],
  //   trim: true,
  // },
  menuname: {
    type: String,
    required: [true, "Menu name is a mandatory field"],
    trim: true,
  },
  description: {
    type: String,
    max: [225, "Characters limit exceed"],
    required: [true, "Menu name is a mandatory field"],
    unique: [true, "Menu name needs to be unique"],
    trim: true,
  },
  category: {
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
    required: [true, "Menu should contained atleast any one of the category"],
  },
});

menuSchema.pre("save", async function () {
  const countDoc = (await this.constructor.countDocuments({})) + 1;
  this._id = "MENU-SPR-" + countDoc;
});

const MenuModel = model("Menus", menuSchema);

export default MenuModel;
