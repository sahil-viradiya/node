import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/user-management");
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection error", error);
    process.exit(1);
  }
};
