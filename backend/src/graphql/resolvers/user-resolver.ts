import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import HttpError from "../../models/HttpError";

import generateToken from "../../util/generateToken";
import User from "../../models/User-schema";
import NodeMailer from "nodemailer";
import SendGridTransport from "nodemailer-sendgrid-transport";

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
  isVerified: boolean;
}

interface userDetailsResponse {
  email: string;
  username: string;
  _id: string;
  Hashedpassword: null;
  isVerified: boolean;
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

const transporter = NodeMailer.createTransport(
  SendGridTransport({ auth: { api_key: process.env.SENDGRID_API } })
);

const signup: userResolver<signUpArgs, signupResponse> = async (args, req) => {
  const { username, email, password } = args.credentials;

  if (!username || !email || !password) {
    console.log("invalid");
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
/*
  transporter.sendMail({
    to: email,
    from: "awesomemuthu28@gmail.com",
    subject: "Sign up successful and verify your account",
    html: `
    <h1>Please click the <a href="localhost:5000"> link</a> to verify your account<h1>
    `,
  });
*/
  return {
    _id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    hashedPassword: null,
    isVerified: createdUser.isVerified,
  };
};

const login: userResolver<loginArgs, authResponse> = async (args, req) => {
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

  let accesstoken = generateToken(user.id);

  return {
    accesstoken,
    email: user.email,
    tokenExpiration: 1,
    isVerified: user.isVerified,
  };
};

const userDetails: userResolver<null, userDetailsResponse> = async (
  args,
  req: any
) => {
  if (!req.isAuth) {
    throw new HttpError("Unauthorized", 401);
  }
  let user;

  try {
    user = await User.findById(req.userId);
  } catch (err) {
    throw new HttpError("Something went wrong", 500);
  }

  if (!user) throw new HttpError("User does not exist", 404);

  return {
    email: user.email,
    username: user.username,
    _id: user._id,
    Hashedpassword: null,
    isVerified: user.isVerified,
  };
};

export default {
  signup,
  login,
  userDetails,
};
