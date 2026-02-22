import { Router } from "express";
import Menu from "../models/menuModel.js";

const menuRouter = Router();

// Add Menu Item
menuRouter.post("/menuitem", async (req, res) => {
  try {
    await Menu.create(req.body);
    res.status(201).json({ message: "Product Created" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: `Product creation failed due to ${error.message}` });
  }
});

// Get Menu Items
menuRouter.get("/menuitem", async (req, res) => {
  try {
    const data = await Menu.find();
    res.status(200).json({ message: "Menu Items", count: data.length, data });
  } catch (error) {
    res.status(404).json({ message: "Menu Item Not Found" });
  }
});

// Add Menu Items
menuRouter.post("/addMenuItems", async (req, res) => {
  try {
    await Menu.insertMany(req.body);
    res.status(201).json({
      message: "Products Posted successfully",
      totalMenuItem: await Menu.countDocuments(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default menuRouter;
