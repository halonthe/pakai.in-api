import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";
import router from "./routes/auth.route.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// connect to mongodb
connectDB();

// routes
app.get("/", (req, res) => {
  res.json({ msg: "oke" });
});
app.use(router);

// listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
