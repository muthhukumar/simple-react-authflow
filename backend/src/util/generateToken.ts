import jwt from "jsonwebtoken";

//require("dotenv").config();

const secret = process.env.ACCESS_TOKEN_SECRET;

export default (userId: string) => {
  return jwt.sign({ userId }, secret!, { expiresIn: "2h" });
};
