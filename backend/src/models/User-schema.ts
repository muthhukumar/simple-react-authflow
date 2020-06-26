import { Schema, model, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface document extends Document {
  username: string;
  email: string;
  hashedPassword: string;
  refreshtoken?: string;
}

const userSchema = new Schema({
  username: {
    type: String,
  },
  refreshtoken: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  hashedPassword: {
    type: String,
  },
});

userSchema.plugin(uniqueValidator);

const User = model<document>("User", userSchema);

export default User;
