import { body } from "express-validator";

// Custom validator to check if a string contains only valid address characters
const isValidAddress = (value) => {
  // Adjust the regex according to what is considered a valid address
  return /^[a-zA-Z\s]+$/.test(value);
};
const isValidMobileNumber = (value) => {
  // Adjust the regex according to your mobile number format
  return /^\d{10}$/.test(value); // Example for exactly 10 digits
};

// Validation rules
export const addressValidationRules = [
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .custom((value) => isValidAddress(value))
    .withMessage("Address can only contain letters and spaces"),
  body("sender_name")
    .notEmpty()
    .withMessage("Sender name is required")
    .isLength({ min: 2 })
    .withMessage("Sender name must be at least 2 characters long"),
  body("sender_mobile")
    .notEmpty()
    .withMessage("Sender mobile is required")
    .custom((value) => isValidMobileNumber(value))
    .withMessage("Sender mobile must be a valid 10-digit number"),
];

