import { Request } from "express";
import bcrypt from "bcryptjs";
import HttpError from "../../models/HttpError";

import { genAccesstoken } from "../../util/generateToken";
import User from "../../models/User-schema";
import SocialAccount from "../../models/SocialUser-schema";

interface signupResponse {
  _id: string;
  username: string;
  email: string;
  hashedPassword: null;
}

interface authResponse {
  accesstoken: string;
  email: string;
  tokenExpiration: number;
}

interface userDetailsResponse {
  email: string;
  username: string;
  _id: string;
  hashedpassword: null;
}

interface signUpArgs {
  credentials: {
    username: string;
    email: string;
    password: string;
  };
}

interface loginArgs {
  credentials: {
    email: string;
    password: string;
  };
}

type userResolver<T, R> = (args: T, req: Request) => Promise<void | R>;

const signup: userResolver<signUpArgs, signupResponse> = async (args) => {
  const { username, email, password } = args.credentials;

  if (!username || !email || !password) {
    throw new HttpError(
      "Invalid credentials passed, check your credentials and try again",
      422
    );
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    throw new HttpError(
      "Error in establishing a database connection to create new user",
      500
    );
  }

  if (existingUser) throw new HttpError("User already exist", 409);

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    throw new HttpError("Something went wrong", 500);
  }

  const newUser = new User({
    username,
    email,
    hashedPassword,
  });

  let createdUser;
  try {
    createdUser = await newUser.save();
  } catch (err) {
    throw new HttpError("Something went wrong", 500);
  }
  return {
    _id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    hashedPassword: null,
  };
};

const login: userResolver<loginArgs, authResponse> = async (args) => {
  const { email, password } = args.credentials;

  if (!email || !password) {
    throw new HttpError(
      "Invalid credentials passed, check your credentials and try again",
      422
    );
  }

  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    throw new HttpError("Something went wrong", 500);
  }

  if (!user) throw new HttpError("user does not exist", 404);

  let isValid;
  try {
    isValid = await bcrypt.compare(password, user.hashedPassword);
  } catch (err) {
    throw new HttpError("Something went wrong", 500);
  }

  if (!isValid) throw new HttpError("Invalid credentials", 401);

  const accesstoken = genAccesstoken(user.id);

  return {
    accesstoken,
    email: user.email,
    tokenExpiration: 1,
  };
};

const userDetails: userResolver<null, userDetailsResponse> = async (
  _,
  req: any
) => {
  if (!req.isAuth) {
    throw new HttpError("Unauthorized", 401);
  }
  let user;
  if (req.isSocialAccount) {
    try {
      user = await SocialAccount.findById(req.userId);
    } catch (err) {
      throw new HttpError("Something went wrong", 500);
    }
  } else {
    try {
      user = await User.findById(req.userId);
    } catch (err) {
      throw new HttpError("Something went wrong", 500);
    }
  }

  if (!user) throw new HttpError("User does not exist", 404);

  return {
    email: user.email,
    username: user.username,
    _id: user._id,
    hashedpassword: null,
  };
};

export default {
  signup,
  login,
  userDetails,
};
