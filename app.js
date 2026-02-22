import express from "express";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import menuRouter from "./routes/menuRoute.js";

const app = express();

// Parser for JSON
app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/menu", menuRouter);

export default app;
