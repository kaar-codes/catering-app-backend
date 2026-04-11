import { Router } from "express";
import {
  getAllMenuItems,
  addMenuItems,
} from "../controllers/menuController.js";
import {
  authenticateUser,
  isAdminUser,
} from "../controllers/authController.js";

const menuRouter = Router();

menuRouter.post("/addMenuItems", authenticateUser, isAdminUser, addMenuItems);
menuRouter.get("/all", authenticateUser, getAllMenuItems);

export default menuRouter;
