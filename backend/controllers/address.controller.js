import Address from "../models/Address.js";
import { validationResult } from "express-validator";
import { verifyToken } from "../middleware/auth.middleware.js";

export const getAddresses = async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return req.status(401).send({ message: "Unauthorized" });
    }
    // console.log(token);
    // const tok = decode(token);

    await verifyToken(token);

    const address = await Address.find();
    return res.status(200).send({ data: address, message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }

  
};

export const saveAddress = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there's only one error, format the response to include just that message
      if (errors.array().length === 1) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      // If there are multiple errors, format them into an array of messages
      const formattedErrors = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }

    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify the token
    try {
      await verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }

    // Check if the address already exists
    const existingAddress = await addressExists(req.body);
    if (existingAddress) {
      return res.status(409).json({ message: "Address already exists" });
    }

    // Create new address
    const newAddress = await Address.create(req.body);
    return res
      .status(200)
      .json({ data: newAddress, message: "Address saved successfully" });
  } catch (error) {
    console.error("Error saving address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Utility function to check if address exists
const addressExists = async (addressData) => {
  return await Address.findOne({
    address: addressData.address,
    landmark: addressData.landmark,
    sender_name: addressData.sender_name,
    sender_mobile: addressData.sender_mobile,
  });
};
