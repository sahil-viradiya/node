import express from "express";
import { getAddresses, saveAddress } from "../controllers/address.controller.js";
import { addressValidationRules } from "../utils/validators.js";

const router = express.Router();

router.get("/", getAddresses);
router.post("/saveAddress", addressValidationRules, saveAddress);

export default router;
