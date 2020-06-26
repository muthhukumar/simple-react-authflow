import jwt from "jsonwebtoken";

//require("dotenv").config();

const accesstoken_secret = process.env.ACCESS_TOKEN_SECRET;
const refreshtoken_secret = process.env.REFRESH_TOKEN_SECRET;

export const genAccesstoken = (payload: {
  isSocialAccount: boolean;
  userId: string;
}): string => {
  return jwt.sign(payload, accesstoken_secret!, { expiresIn: "6h" });
};

export const genRefreshtoken = (payload: {
  isSocialAccount: boolean;
  userId: string;
}): string => {
  return jwt.sign(payload, refreshtoken_secret!, { expiresIn: "72h" });
};
