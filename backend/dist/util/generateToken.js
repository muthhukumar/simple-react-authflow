"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRefreshtoken = exports.genAccesstoken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//require("dotenv").config();
const accesstoken_secret = process.env.ACCESS_TOKEN_SECRET;
const refreshtoken_secret = process.env.REFRESH_TOKEN_SECRET;
exports.genAccesstoken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, accesstoken_secret, { expiresIn: "6h" });
};
exports.genRefreshtoken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, refreshtoken_secret, { expiresIn: "72h" });
};
