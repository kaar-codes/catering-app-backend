import { Schema, model } from "mongoose";

const menuCategoryCodes = new Map([
  ["01", "BRUNCH"],
  ["02", "BREAKFAST"],
  ["03", "LUNCH"],
  ["04", "DRINKS AND BEVERAGES"],
  ["05", "STALL ITEMS OR EXTRAS"],
  ["06", "SAVOURIES AND SWEETS"],
  ["07", "STARTERS AND SIDE DISHES"],
  ["08", "DINNER"],
]);

const menuSchema = new Schema(
  {
    mid: {
      type: String,
      required: [true, "Menu id is mandatory"],
      unique: [true, "Menu ID already exist"],
    },
    menuname: {
      type: String,
      required: [true, "Menu name is mandatory"],
      unique: [true, "Menu name already in the DB"],
    },
    description: {
      type: String,
      required: [true, "Menu description is mandatory"],
      max: [250, "Max limit (250) is reached"],
      unique: [true, "Description is same as another menu"],
      trim: [true],
    },
    category: {
      type: [String],
      enum: {
        values: Array.from(menuCategoryCodes.keys()),
        message: "Not Supported in category field",
      },
      required: [true, "Category required"],
    },
  },
  { versionKey: false },
);

const MenuModel = model("Menu", menuSchema);

export default MenuModel;
