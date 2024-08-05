// Import the necessary modules
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import usersSchema from "./database/schema/users.js";
import AddAddressSchema from "./database/schema/add.address.js";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import addAddress from "./database/schema/add.address.js";
import { body, validationResult } from "express-validator";

// Load environment variables from a .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Utility function to verify JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "TESTSTE", (err, decoded) => {
      if (err) {
        reject(new Error("Invalid token"));
      } else {
        resolve(decoded);
      }
    });
  });
};

// Utility function to check if address exists
const addressExists = async (addressData) => {
  return await addAddress.findOne({
    address: addressData.address,
    landmark: addressData.landmark,
    sender_name: addressData.sender_name,
    sender_mobile: addressData.sender_mobile,
  });
};

// Sample user data
var userData = { name: "sahil v" };

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Define a route for '/get' that returns an email
app.get("/users", async (req, res) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    jwt.verify(token, "TESTSTE", (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid token" });
      }
      console.log(decoded);
      req.user = decoded;
    });

    console.log("req.uyser", req.user);

    const user = await usersSchema.findOne({ email: req.user.email });

    return res
      .status(200)
      .send({ data: user, message: "User fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.email && req.body.password) {
      const createdUser = await usersSchema.create(req.body);

      return res
        .status(201)
        .send({ data: createdUser, message: "User created successfully" });
    } else {
      return res.status(403).send({ message: "All fields are required" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});
// Custom validator to check if a string contains only valid address characters
const isValidAddress = (value) => {
  // Adjust the regex according to what is considered a valid address
  return /^[a-zA-Z\s]+$/.test(value);
};
const isValidMobileNumber = (value) => {
  // Adjust the regex according to your mobile number format
  return /^\d{10}$/.test(value); // Example for exactly 10 digits
};
app.post(
  "/saveAddress",
  [
    // Validation middleware
    body("address")
      .notEmpty()
      .withMessage("Address is required")
      .custom(isValidAddress)
      .withMessage("Address must only contain letters and spaces"),
    body("landmark")
      .notEmpty()
      .withMessage("Landmartk is required")
      .custom(isValidAddress)
      .withMessage("Landmark must only contain letters and spaces"),
    body("sender_name")
      .notEmpty()
      .withMessage("Sender name is required")
      .custom(isValidAddress)
      .withMessage("Sender name must only contain letters and spaces"),
    body("sender_mobile")
      .notEmpty()
      .withMessage("Sender mobile is required")
      .custom(isValidMobileNumber)
      .withMessage("Mobile number must be 10 digits"),
  ],
  async (req, res) => {
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
      const newAddress = await addAddress.create(req.body);
      return res
        .status(200)
        .json({ data: newAddress, message: "Address saved successfully" });
    } catch (error) {
      console.error("Error saving address:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Define a route for '/user' that returns user data as JSON
app.post("/login", async (req, res) => {
  try {
    const user = await usersSchema.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      return res.status(404).send({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email: user.email }, "TESTSTE", {
      expiresIn: "24h",
    });

    return res
      .status(200)
      .send({ token: token, message: "LoggedIn successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/address", (req, res) => {
  console.log("req.user", req.user);

  res.status(200).send({
    status: true,
    message: "Success!",
    data: [
      {
        id: 1,
        user_id: 27,
        address: "notion",
        landmark: "",
        sender_name: "sahil",
        sender_mobile: "9725558828",
      },
      {
        id: 2,
        user_id: 27,
        address: "uday",
        landmark: "",
        sender_name: "piyush",
        sender_mobile: "1234657890",
      },
      {
        id: 3,
        user_id: 27,
        address: "uday",
        landmark: "",
        sender_name: "yash",
        sender_mobile: "1234657890",
      },
    ],
  });
});
// Start the server and listen on the specified port

mongoose
  .connect("mongodb://127.0.0.1:27017/user-management")
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Database connection error");
  });
