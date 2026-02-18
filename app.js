import express from "express";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();

// Parser for JSON
app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);

export default app;
