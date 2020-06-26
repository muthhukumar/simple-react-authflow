import jwt from "jsonwebtoken";
import { NextFunction } from "express";

export default (req: any, _: any, next: NextFunction) => {
  const header = req.get("Authorization");
  if (!header) {
    req.isAuth = false;
    return next();
  }

  const token = header.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let payload: any;

  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!payload) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = payload.userId;
  req.isSocialAccount = payload.isSocialAccount;
  return next();
};
