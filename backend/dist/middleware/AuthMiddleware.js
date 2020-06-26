"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, _, next) => {
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
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch (err) {
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
