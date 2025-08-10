import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import "dotenv/config";

import connectDB from "./configs/db.js";
import passport from "./configs/passport.js";
import router from "./routes/index.js";

const app = express();

// 1 - create middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize())

// 2 - connect to mongodb
connectDB()

// 3 - create routes
router(app);

// 4 - listen app
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
