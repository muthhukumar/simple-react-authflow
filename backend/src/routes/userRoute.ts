import User from "../models/User-schema";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { genRefreshtoken, genAccesstoken } from "../util/generateToken";
import HttpError from "../models/HttpError";
import SocialAccount from "../models/SocialUser-schema";

const router = Router();

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new HttpError(
        "Invalid credentials passed, check your credentials and try again",
        422
      )
    );
  }

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  if (!user) return next(new HttpError("user does not exist", 404));

  let isValid;
  try {
    isValid = await bcrypt.compare(password, user.hashedPassword);
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  if (!isValid) return next(new HttpError("Invalid credentials", 401));

  const accesstoken = genAccesstoken({
    isSocialAccount: false,
    userId: user._id,
  });

  const refreshtoken = genRefreshtoken({
    isSocialAccount: false,
    userId: user._id,
  });

  user.refreshtoken = refreshtoken;

  try {
    await user.save();
  } catch (err) {
    return next(new HttpError("Something went wrong", 500));
  }

  res.cookie("refreshtoken", refreshtoken, {
    path: "/user/refresh_token",
    httpOnly: true,
  });

  res.status(200).json({ accesstoken });
});

router.get("/refresh_token", async (req: any, res, next) => {
  const token = req.cookies.refreshtoken;

  if (!token) return next(new Error("You need to login"));

  let payload: any;

  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return next(new Error("Invalid Token"));
  }

  let user, refreshtoken, accesstoken;
  if (payload.isSocialAccount) {
    try {
      user = await SocialAccount.findById(payload.userId);
    } catch (err) {
      return next(new Error("Something went wrong"));
    }

    if (!user) return next(new Error("User not found"));

    if (user.refreshtoken !== token || !user.refreshtoken) {
      return next(new Error("Invalid Token"));
    }

    refreshtoken = genRefreshtoken({ isSocialAccount: true, userId: user._id });
    user.refreshtoken = refreshtoken;
    accesstoken = genAccesstoken({ isSocialAccount: true, userId: user._id });
    try {
      await user.save();
    } catch (err) {
      return next(new Error("something went wrong"));
    }
  } else {
    try {
      user = await User.findById(payload.userId);
    } catch (err) {
      return next(new Error("Something went wrong"));
    }

    if (!user) return next(new Error("User not found"));

    if (user.refreshtoken !== token || !user.refreshtoken)
      return next(new Error("Invalid Token"));

    refreshtoken = genRefreshtoken({
      userId: user._id,
      isSocialAccount: false,
    });
    user.refreshtoken = refreshtoken;
    accesstoken = genAccesstoken({ userId: user._id, isSocialAccount: false });
    try {
      await user.save();
    } catch (err) {
      return next(new Error("something went wrong"));
    }
  }

  res.cookie("refreshtoken", refreshtoken, {
    path: "/user/refresh_token",
    httpOnly: true,
  });

  res.status(200).json({ accesstoken });
});

router.post("/googleSocialLogin", async (req: any, res, next) => {
  const { username, email, googleId } = req.body;
  if (
    !username ||
    !email ||
    !googleId ||
    username === "" ||
    email === "" ||
    googleId === ""
  )
    return next(new Error("Invalid inputs passed"));

  let user;
  try {
    user = await SocialAccount.findOne({ googleId });
  } catch (err) {
    return next(new Error("Something went wrong"));
  }

  let refreshtoken;
  if (!user) {
    let newUserSocialAccount = new SocialAccount({
      googleId,
      username,
      email,
    });
    refreshtoken = genRefreshtoken({
      userId: newUserSocialAccount._id,
      isSocialAccount: true,
    });

    newUserSocialAccount.refreshtoken = refreshtoken;
    try {
      await newUserSocialAccount.save();
    } catch (err) {
      return next(new Error(err));
    }
    user = newUserSocialAccount;
  } else {
    refreshtoken = genRefreshtoken({ userId: user._id, isSocialAccount: true });
    user.refreshtoken = refreshtoken;
    try {
      await user.save();
    } catch (err) {
      return next(new Error(err));
    }
  }
  const accesstoken = genAccesstoken({
    userId: user._id,
    isSocialAccount: true,
  });

  res.cookie("refreshtoken", refreshtoken, {
    path: "/user/refresh_token",
    httpOnly: true,
  });

  res.status(200).json({ accesstoken });
});

router.post("/facebookSocialLogin", async (req: any, res, next) => {
  const { username, email, facebookId } = req.body;
  if (
    !username ||
    !email ||
    !facebookId ||
    username === "" ||
    email === "" ||
    facebookId === ""
  )
    return next(new Error("Invalid inputs passed"));

  let user;
  try {
    user = await SocialAccount.findOne({ facebookId });
  } catch (err) {
    return next(new Error("Something went wrong"));
  }

  let refreshtoken;
  if (!user) {
    let newUserSocialAccount = new SocialAccount({
      facebookId,
      username,
      email,
    });
    refreshtoken = genRefreshtoken({
      userId: newUserSocialAccount._id,
      isSocialAccount: true,
    });

    newUserSocialAccount.refreshtoken = refreshtoken;
    try {
      await newUserSocialAccount.save();
    } catch (err) {
      return next(new Error(err));
    }
    user = newUserSocialAccount;
  } else {
    refreshtoken = genRefreshtoken({ userId: user._id, isSocialAccount: true });
    user.refreshtoken = refreshtoken;
    try {
      await user.save();
    } catch (err) {
      return next(new Error(err));
    }
  }
  const accesstoken = genAccesstoken({
    userId: user._id,
    isSocialAccount: true,
  });

  res.cookie("refreshtoken", refreshtoken, {
    path: "/user/refresh_token",
    httpOnly: true,
  });

  res.status(200).json({ accesstoken });
});

router.get("/logout", (_, res, _1) => {
  res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
  res.status(200).json({ message: "Logged out" });
});

export default router;
