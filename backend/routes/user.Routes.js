import express from "express";
import {
  getUsers,
  registerUser,
  loginUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
