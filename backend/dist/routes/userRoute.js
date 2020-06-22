"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_schema_1 = __importDefault(require("../models/User-schema"));
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../util/generateToken");
const HttpError_1 = __importDefault(require("../models/HttpError"));
const router = express_1.Router();
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HttpError_1.default("Invalid credentials passed, check your credentials and try again", 422));
    }
    let user;
    try {
        user = yield User_schema_1.default.findOne({ email });
    }
    catch (err) {
        return next(new HttpError_1.default("Something went wrong", 500));
    }
    if (!user)
        return next(new HttpError_1.default("user does not exist", 404));
    let isValid;
    try {
        isValid = yield bcryptjs_1.default.compare(password, user.hashedPassword);
    }
    catch (err) {
        return next(new HttpError_1.default("Something went wrong", 500));
    }
    if (!isValid)
        return next(new HttpError_1.default("Invalid credentials", 401));
    const accesstoken = generateToken_1.genAccesstoken(user.id);
    const refreshtoken = generateToken_1.genRefreshtoken(user.id);
    user.refreshtoken = refreshtoken;
    try {
        yield user.save();
    }
    catch (err) {
        return next(new Error("Something went wrong"));
    }
    res.cookie("refreshtoken", refreshtoken, {
        path: "/user/refresh_token",
        httpOnly: true,
    });
    res.status(200).json({ accesstoken });
}));
router.get("/refresh_token", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshtoken;
    if (!token)
        return next(new Error("You need to login"));
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        return next(new Error("Invalid Token"));
    }
    let user;
    try {
        user = yield User_schema_1.default.findById(payload.userId);
    }
    catch (err) {
        return next(new Error("Something went wrong"));
    }
    if (!user)
        return next(new Error("User not found"));
    if (user.refreshtoken !== token || !user.refreshtoken)
        return next(new Error("Invalid Token"));
    const refreshtoken = generateToken_1.genRefreshtoken(user._id);
    user.refreshtoken = refreshtoken;
    const accesstoken = generateToken_1.genAccesstoken(user._id);
    try {
        yield user.save();
    }
    catch (err) {
        return next(new Error("something went wrong"));
    }
    res.cookie("refreshtoken", refreshtoken, {
        path: "/user/refresh_token",
        httpOnly: true,
    });
    res.status(200).json({ accesstoken });
}));
router.get("/logout", (req, res, next) => {
    res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
    res.status(200).json({ message: "Logged out" });
});
exports.default = router;
