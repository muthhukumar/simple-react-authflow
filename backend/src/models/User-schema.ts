import { Schema, model, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

interface document extends Document {
    username: string;
    email: string;
    hashedPassword: string;
    isVerified: boolean;
    refreshtoken?: string;
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    refreshtoken: {
        type: String,
    }
});

userSchema.plugin(uniqueValidator);

const User = model<document>("User", userSchema);

export default User;
