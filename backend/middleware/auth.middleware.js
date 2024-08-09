import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
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
