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

menuSchema.pre("insertMany", async function (docs) {
  for (const curDoc of Object.values(docs)) {
    const menuItem = await this.find({ menuname: curDoc.menuname });
    if (menuItem.length) {
      const belongsToSameCategory = menuItem
        .at(0)
        .category.includes(...curDoc.category);
      if (belongsToSameCategory) {
        throw new Error(
          `Item you are trying to add in the DB, already exist as ${menuItem.at(0).mid} under the same category.`,
        );
      }
    }
  }
});

const MenuModel = model("Menu", menuSchema);

export default MenuModel;
