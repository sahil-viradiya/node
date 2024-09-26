import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    console.log({ token });

    req.user = jwt.verify(token, "TESTSTE");
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" });
  }
};
