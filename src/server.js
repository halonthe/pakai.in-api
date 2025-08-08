import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";
import router from "./routes/index.js";

const app = express();

// 1 - create middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2 - connect to mongodb
connectDB()

// 3 - routes
router(app);

// 4 - listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
