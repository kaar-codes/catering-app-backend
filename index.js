import { config } from "dotenv";
config({ path: [".env"] });
import server from "./app.js";
import { connect } from "mongoose";
const PORT = 3000;

/**
 * Connect to the Cluster of MongoDB
 */
async function connectDB() {
  try {
    await connect(process.env.DB_CONN);
    console.log("DB connection succeed");
  } catch (err) {
    console.log("DB Connection unsuccessfull");
    console.log(err.message);
  }
}
connectDB();

server.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
