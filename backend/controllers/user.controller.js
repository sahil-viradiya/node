import User from "../models/User.js";
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
    const user = await User.findOne({
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
};
