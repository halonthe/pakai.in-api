import mongoose from "mongoose";
import 'dotenv/config'

export default async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('database connected!')
    } catch (error) {
        console.error('Error: ', error.message)
    }
}