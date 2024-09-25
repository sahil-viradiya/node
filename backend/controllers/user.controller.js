import User from "../models/User.js";
import LogedUser from "../models/User.js";

import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
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

    console.log("req.user", req.user);

    const user = await User.findOne({ email: req.user.email });

    return res
      .status(200)
      .send({ data: user, message: "User fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    console.log("req.body", req.body);
    if (req.body.email && req.body.password) {
      const createdUser = await User.create(req.body);

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
};

export const loginUser = async (req, res) => {
  try {
    console.log("Email from request body:", req.body.email); // Check if email is coming correctly

  let user = await User.findOne({
    email: req.body.email,
  });

  console.log("User found:", user); // Check if user is found

  if (!user) {
    return res.status(404).send({ message: "Invalid Email" });
  }

  // Compare password after confirming the email exists
  if (user.password != req.body.password) {
    return res.status(404).send({ message: "Invalid Password" });
  } 

    const token = jwt.sign({ email: user.email }, "TESTSTE", {
      expiresIn: "24h",
    });

    const name = user.name;

    // Function to generate a random string (prefix)
    const generateRandomString = (length) => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };

    // Generate the prefix (e.g., 'SAFARR' or other random letters)
    const prefix = generateRandomString(6); // Adjust the length as needed (6 characters here)

    // Generate a random 5-digit number
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // This ensures a 5-digit number

    // Combine the prefix and number for the username
    const uniq_username = `${prefix}${randomNumber}`;
    console.log(uniq_username);

    if (user.isLogin == false && user.userName == "") {
      user = await User.findByIdAndUpdate(
        user._id,
        { isLogin: true, userName: uniq_username },
        { new: true }
      );
    }

    return res.status(200).send({
      token: token,
      message: "LoggedIn successfully",
      username: user.userName,
      isLogin: user.isLogin,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
  const createdUser = await LogedUser.create(res.body);
};
