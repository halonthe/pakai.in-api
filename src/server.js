import express from "express";
import cors from 'cors'
import "dotenv/config";
import connectDB from "./configs/db.js";

const app = express();

// middleware
app.use(cors())
app.use(express.json())

// connect to mongodb
connectDB()

// listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
