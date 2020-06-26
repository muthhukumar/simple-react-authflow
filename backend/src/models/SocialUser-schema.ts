import { Document, Schema, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface SocialAccountType extends Document {
  refreshtoken: string;
  googleId?: string;
  facebookId?: string;
  username: string;
  email: string;
}
const socialAccountUser = new Schema({
  refreshtoken: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
  },
  facebookId: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
});

socialAccountUser.plugin(uniqueValidator);

const SocialAccount = model<SocialAccountType>(
  "SocialAccountUser",
  socialAccountUser
);

export default SocialAccount;
