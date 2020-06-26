"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const socialAccountUser = new mongoose_1.Schema({
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
socialAccountUser.plugin(mongoose_unique_validator_1.default);
const SocialAccount = mongoose_1.model("SocialAccountUser", socialAccountUser);
exports.default = SocialAccount;
