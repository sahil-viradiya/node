import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.Routes.js";
import addressRoutes from "./routes/address.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
