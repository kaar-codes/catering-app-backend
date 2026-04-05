import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import menuRouter from "./routes/menuRoute.js";
import quoteRouter from "./routes/quoteRoute.js";
import { authenticateUser } from "./controllers/authController.js";

const app = express();

app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  }),
);

// Parser for JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/testRoute", async (req, res) => {
  res.status(202).json({ message: "Test Route" });
});

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/menu", menuRouter);
app.use("/quote", authenticateUser, quoteRouter);

export default app;
