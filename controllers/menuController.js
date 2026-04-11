import MenuModel from "../models/menuModel.js";

export async function getAllMenuItems() {
  try {
    const menus = await MenuModel.find();
    res.status(200).json({ status: true, menus });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
}

export async function addMenuItems(req, res) {
  try {
    await MenuModel.insertMany(req.body);
    res.status(201).json({ status: true, message: "Menu Item Created" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
}
